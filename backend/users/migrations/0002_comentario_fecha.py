# Generated by Django 5.0.1 on 2024-03-07 01:06

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comentario',
            name='fecha',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
