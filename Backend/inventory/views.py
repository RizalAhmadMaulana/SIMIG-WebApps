from django.db.models import Sum, F, Count
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import Category, Product, TransactionIn, TransactionOut
from .serializers import CategorySerializer, ProductSerializer, TransactionInSerializer, TransactionOutSerializer
from django.db.models.functions import TruncMonth, TruncDay, TruncYear
from datetime import timedelta
import locale

# Set locale ke Indonesia
try:
    locale.setlocale(locale.LC_TIME, 'id_ID.utf8')
except:
    pass 


# --- ViewSets ---
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class TransactionInViewSet(viewsets.ModelViewSet):
    queryset = TransactionIn.objects.all().order_by('-date', '-created_at')
    serializer_class = TransactionInSerializer
    permission_classes = [permissions.IsAuthenticated]

class TransactionOutViewSet(viewsets.ModelViewSet):
    queryset = TransactionOut.objects.all().order_by('-date', '-created_at')
    serializer_class = TransactionOutSerializer
    permission_classes = [permissions.IsAuthenticated]

# --- DASHBOARD LOGIC BARU ---
class DashboardDataView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # 1. Total Aset (Berat * Harga)
        total_asset = Product.objects.aggregate(
            total=Sum(F('weight') * F('price_per_kg'))
        )['total'] or 0

        # 2. Total Berat Gudang (Semua barang ditotal Kg-nya)
        total_weight = Product.objects.aggregate(
            total=Sum('weight')
        )['total'] or 0

        # 3. Stok Menipis (Logic: Berat < 50 Kg) - Angka 50 bisa diubah
        lowest_product = Product.objects.order_by('weight').first()
        
        if lowest_product:
            lowest_stock_data = {
                "name": lowest_product.name,
                "stock": lowest_product.weight # Kita kirim berat sebagai 'stock' untuk frontend
            }
        else:
            lowest_stock_data = {
                "name": "-", 
                "stock": 0 
            }

        # 4. Pendapatan Bulan Ini
        current_month = timezone.now().month
        current_year = timezone.now().year
        trans_out_month = TransactionOut.objects.filter(
            date__month=current_month, 
            date__year=current_year
        )
        income_month = 0
        for item in trans_out_month:
            income_month += item.quantity * item.product.price_per_kg

        # 5. Data Tabel Terbaru
        recent_in = TransactionIn.objects.all().order_by('-date', '-created_at')[:5]
        recent_out = TransactionOut.objects.all().order_by('-date', '-created_at')[:5]

        in_serializer = TransactionInSerializer(recent_in, many=True)
        out_serializer = TransactionOutSerializer(recent_out, many=True)

        return Response({
            "total_asset": total_asset,
            "total_stock": total_weight, # Nilai ini sekarang Kg
            "lowest_stock_item": lowest_stock_data,
            "income_month": income_month,
            "recent_in": in_serializer.data,
            "recent_out": out_serializer.data
        })
    
class ReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'bulanan') 
        today = timezone.now().date()
        
        bar_labels = []
        bar_values = []
        
        # LOGIC CHART (Menggunakan Quantity yg sekarang Decimal/Kg)
        if period == 'mingguan':
            start_date = today - timedelta(days=6)
            date_info = f"{start_date.strftime('%d %B')} s/d {today.strftime('%d %B %Y')}"
            
            data_query = TransactionOut.objects.filter(date__gte=start_date)\
                .annotate(day=TruncDay('date'))\
                .values('day')\
                .annotate(total=Sum('quantity'))\
                .order_by('day')

            chart_data = {}
            for i in range(7):
                d = start_date + timedelta(days=i)
                label = d.strftime('%A')
                chart_data[label] = 0
            
            for item in data_query:
                label = item['day'].strftime('%A')
                chart_data[label] = item['total']

            bar_labels = list(chart_data.keys())
            bar_values = list(chart_data.values())

        elif period == 'bulanan':
            start_date = today.replace(day=1)
            date_info = f"{start_date.strftime('%B %Y')}"
            
            transactions = TransactionOut.objects.filter(
                date__year=today.year, 
                date__month=today.month
            )

            weeks_data = {"Minggu 1": 0, "Minggu 2": 0, "Minggu 3": 0, "Minggu 4": 0}

            for t in transactions:
                day = t.date.day
                if day <= 7: weeks_data["Minggu 1"] += t.quantity
                elif day <= 14: weeks_data["Minggu 2"] += t.quantity
                elif day <= 21: weeks_data["Minggu 3"] += t.quantity
                else: weeks_data["Minggu 4"] += t.quantity

            bar_labels = list(weeks_data.keys())
            bar_values = list(weeks_data.values())

        elif period == 'tahunan':
            start_date = today.replace(month=1, day=1)
            date_info = f"Tahun {today.year}"
            
            data_query = TransactionOut.objects.filter(date__year=today.year)\
                .annotate(month=TruncMonth('date'))\
                .values('month')\
                .annotate(total=Sum('quantity'))\
                .order_by('month')

            chart_data = {
                "Januari": 0, "Februari": 0, "Maret": 0, "April": 0, "Mei": 0, "Juni": 0,
                "Juli": 0, "Agustus": 0, "September": 0, "Oktober": 0, "November": 0, "Desember": 0
            }
            month_map = {
                1: "Januari", 2: "Februari", 3: "Maret", 4: "April", 5: "Mei", 6: "Juni",
                7: "Juli", 8: "Agustus", 9: "September", 10: "Oktober", 11: "November", 12: "Desember"
            }

            for item in data_query:
                m_idx = item['month'].month
                label = month_map[m_idx]
                chart_data[label] = item['total']

            bar_labels = list(chart_data.keys())
            bar_values = list(chart_data.values())

        # PIE CHART (Per Produk dalam Kg)
        pie_data_query = TransactionOut.objects.filter(date__gte=start_date)\
            .values('product__name')\
            .annotate(total=Sum('quantity'))\
            .order_by('-total')

        pie_labels = [item['product__name'] for item in pie_data_query]
        pie_values = [item['total'] for item in pie_data_query]

        # SUMMARY
        trans_in = TransactionIn.objects.filter(date__gte=start_date)
        trans_out = TransactionOut.objects.filter(date__gte=start_date)

        total_in = trans_in.aggregate(sum=Sum('quantity'))['sum'] or 0
        total_out = trans_out.aggregate(sum=Sum('quantity'))['sum'] or 0
        
        revenue = sum(t.quantity * t.product.price_per_kg for t in trans_out)
        asset_in = sum(t.quantity * t.product.price_per_kg for t in trans_in)
        asset_change = asset_in - revenue

        return Response({
            "pie_chart": {"labels": pie_labels, "data": pie_values},
            "bar_chart": {"labels": bar_labels, "data": bar_values},
            "summary": {
                "total_in": total_in,
                "total_out": total_out,
                "revenue": revenue,
                "asset_change": asset_change,
                "date_info": date_info
            }
        })