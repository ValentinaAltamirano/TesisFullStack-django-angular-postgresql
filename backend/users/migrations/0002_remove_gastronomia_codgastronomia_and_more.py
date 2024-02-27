# Generated by Django 5.0.1 on 2024-02-27 03:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gastronomia',
            name='codGastronomia',
        ),
        migrations.AlterField(
            model_name='gastronomia',
            name='establecimiento_ptr',
            field=models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='users.establecimiento'),
        ),
    ]