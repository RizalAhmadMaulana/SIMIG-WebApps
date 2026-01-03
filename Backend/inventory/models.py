from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    # Relasi: 1 Barang punya 1 Kategori. 
    # on_delete=models.CASCADE artinya kalau Kategori "Plastik" dihapus, semua barang plastik ikut terhapus.
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=50, blank=True, null=True) # Warna
    weight = models.DecimalField(max_digits=10, decimal_places=2, help_text="Berat dalam Kg")
    price_per_kg = models.DecimalField(max_digits=15, decimal_places=0, help_text="Harga per Kg (Rupiah)")
    stock = models.IntegerField(default=0) # Stok Awal
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class TransactionIn(models.Model):
    # Relasi ke Product. Kalau produk dihapus, riwayatnya juga hilang (CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions_in')
    
    date = models.DateField() # Tanggal masuk
    quantity = models.IntegerField() # Jumlah yang masuk
    notes = models.TextField(blank=True, null=True) # Catatan (opsional)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.quantity}"
    
class TransactionOut(models.Model):
    # Relasi ke Product
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='transactions_out')
    
    date = models.DateField()
    quantity = models.IntegerField()
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"OUT - {self.product.name} - {self.quantity}"