# Generated by Django 5.0.1 on 2024-01-19 00:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_usuario_nombreusuario'),
    ]

    operations = [
        migrations.RenameField(
            model_name='empresario',
            old_name='RazonSocial',
            new_name='razonSocial',
        ),
    ]
