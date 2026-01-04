from django.db import models, transaction  # Wajib import transaction
from django.db.models import F             # Wajib import F (untuk hitungan database)

class Category(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=50, blank=True, null=True)
    
    # Pastikan DecimalField agar bisa koma
    weight = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Total Berat (Kg)")
    price_per_kg = models.DecimalField(max_digits=15, decimal_places=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class TransactionIn(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions_in')
    date = models.DateField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2) # Decimal agar presisi
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # --- LOGIC TAMBAH BERAT (Barang Masuk) ---
    def save(self, *args, **kwargs):
        # Gunakan Atomic: Jika error di tengah, semua batal (aman)
        with transaction.atomic():
            is_new = self.pk is None
            super().save(*args, **kwargs) # Simpan dulu transaksinya
            
            if is_new:
                # Update langsung di Database (Lebih cepat & anti-race condition)
                Product.objects.filter(pk=self.product.pk).update(weight=F('weight') + self.quantity)

    # --- LOGIC HAPUS BERAT (Undo Barang Masuk) ---
    def delete(self, *args, **kwargs):
        with transaction.atomic():
            # Kembalikan berat (Kurangi) sebelum transaksi dihapus
            Product.objects.filter(pk=self.product.pk).update(weight=F('weight') - self.quantity)
            super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - +{self.quantity} Kg"
    
class TransactionOut(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions_out')
    date = models.DateField()
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # --- LOGIC KURANGI BERAT (Barang Keluar) ---
    def save(self, *args, **kwargs):
        with transaction.atomic():
            is_new = self.pk is None
            super().save(*args, **kwargs)
            
            if is_new:
                # Update Kurangi Berat
                Product.objects.filter(pk=self.product.pk).update(weight=F('weight') - self.quantity)

    # --- LOGIC KEMBALIKAN BERAT (Undo Barang Keluar) ---
    def delete(self, *args, **kwargs):
        with transaction.atomic():
            # Kembalikan berat (Tambah lagi karena batal keluar)
            Product.objects.filter(pk=self.product.pk).update(weight=F('weight') + self.quantity)
            super().delete(*args, **kwargs)

    def __str__(self):
        return f"OUT - {self.product.name} - -{self.quantity} Kg"