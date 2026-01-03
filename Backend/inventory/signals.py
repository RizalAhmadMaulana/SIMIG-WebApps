from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import TransactionIn, TransactionOut

# --- CCTV 1: Saat Transaksi Masuk DIBUAT ---
@receiver(post_save, sender=TransactionIn)
def update_stock_on_add(sender, instance, created, **kwargs):
    if created: # Hanya jalankan kalau ini data baru (bukan edit)
        product = instance.product
        product.stock += instance.quantity
        product.save()

# --- CCTV 2: Saat Transaksi Masuk DIHAPUS ---
@receiver(post_delete, sender=TransactionIn)
def update_stock_on_delete(sender, instance, **kwargs):
    product = instance.product
    # Kembalikan stok (kurangi) karena transaksi dibatalkan
    product.stock -= instance.quantity
    product.save()

# --- CCTV 3: Saat Barang Keluar DIBUAT (Kurangi Stok) ---
@receiver(post_save, sender=TransactionOut)
def update_stock_on_out_add(sender, instance, created, **kwargs):
    if created:
        product = instance.product
        product.stock -= instance.quantity # KURANGI Stok
        product.save()

# --- CCTV 4: Saat Barang Keluar DIHAPUS (Balikin Stok) ---
@receiver(post_delete, sender=TransactionOut)
def update_stock_on_out_delete(sender, instance, **kwargs):
    product = instance.product
    product.stock += instance.quantity # TAMBAH Stok (Refund)
    product.save()