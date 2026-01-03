from django.apps import AppConfig

class InventoryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'inventory'

    # Tambahkan fungsi ini untuk mengaktifkan Signals
    def ready(self):
        import inventory.signals