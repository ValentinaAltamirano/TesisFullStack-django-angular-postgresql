# Generated by Django 5.0.1 on 2024-02-07 05:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0028_alojamientos_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='establecimiento',
            name='metodos_de_pago',
            field=models.ManyToManyField(related_name='establecimientos', to='users.metododepago'),
        ),
        migrations.DeleteModel(
            name='EstablecimientoXMetodoPago',
        ),
    ]