import datetime
from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion

def add_profile_field_if_not_exists(apps, schema_editor):
    from django.db import connection
    cursor = connection.cursor()
    
    # Verifica se a coluna já existe
    cursor.execute("""
        SELECT COUNT(*)
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'members_profilependencia'
        AND COLUMN_NAME = 'profile_id'
    """)
    
    if cursor.fetchone()[0] == 0:
        # Coluna não existe, cria normalmente
        cursor.execute("""
            ALTER TABLE members_profilependencia
            ADD COLUMN profile_id INT NOT NULL
        """)
        cursor.execute("""
            ALTER TABLE members_profilependencia
            ADD CONSTRAINT members_profilependencia_profile_id_fk
            FOREIGN KEY (profile_id) REFERENCES members_profile(id)
        """)


class Migration(migrations.Migration):
    dependencies = [
        ('members', '0006_alter_profilependencia_id'),
    ]
    operations = [
        migrations.RunPython(add_profile_field_if_not_exists, migrations.RunPython.noop),
    ]
