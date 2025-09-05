import datetime
from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('members', '0006_alter_profilependencia_id'),
    ]
    operations = [
        migrations.AddField(
            model_name='ProfilePendencia',
            name='profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='members.profile'),
        ),
    ]
