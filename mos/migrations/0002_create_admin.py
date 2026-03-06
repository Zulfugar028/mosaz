from django.db import migrations

def create_superuser(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    User.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='Admin12345'
    )

class Migration(migrations.Migration):

    dependencies = [
        ('mos', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]