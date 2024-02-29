# Generated by Django 5.0.1 on 2024-02-29 01:45

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('codCategoria', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Ciudad',
            fields=[
                ('codCiudad', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Empresario',
            fields=[
                ('idEmpresario', models.AutoField(primary_key=True, serialize=False)),
                ('razonSocial', models.CharField(max_length=255)),
                ('descripcion', models.TextField()),
                ('telefono', models.CharField(max_length=20)),
                ('user', models.OneToOneField(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='MetodoDePago',
            fields=[
                ('codMetodoDePago', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Pais',
            fields=[
                ('codPais', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoAlojamiento',
            fields=[
                ('codTipoAlojamiento', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoComercio',
            fields=[
                ('codTipoComercio', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoComida',
            fields=[
                ('codTipoComida', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoEstablecimiento',
            fields=[
                ('codTipoEstablecimiento', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoGastronomia',
            fields=[
                ('codTipoGastronomia', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoPrefAliment',
            fields=[
                ('codTipoPrefAliment', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoServGastro',
            fields=[
                ('codTipoServGastro', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='TipoServicio',
            fields=[
                ('codTipoServicio', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Establecimiento',
            fields=[
                ('codEstablecimiento', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
                ('calle', models.CharField(max_length=255)),
                ('altura', models.CharField(default='0', max_length=255)),
                ('descripcion', models.TextField(default='Sin descripcion', max_length=255)),
                ('telefono', models.CharField(max_length=255)),
                ('web', models.TextField(default='', max_length=255)),
                ('codCiudad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.ciudad')),
                ('empresario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='establecimientos', to='users.empresario')),
                ('metodos_de_pago', models.ManyToManyField(related_name='establecimientos', to='users.metododepago')),
                ('tipoEstablecimiento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.tipoestablecimiento')),
            ],
        ),
        migrations.CreateModel(
            name='Imagen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imagen', models.ImageField(upload_to='imagenes_establecimiento/')),
                ('establecimiento', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='imagenes', to='users.establecimiento')),
            ],
        ),
        migrations.CreateModel(
            name='Provincia',
            fields=[
                ('codProvincia', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
                ('codPais', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.pais')),
            ],
        ),
        migrations.AddField(
            model_name='ciudad',
            name='codProvincia',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.provincia'),
        ),
        migrations.CreateModel(
            name='Turista',
            fields=[
                ('codTurista', models.AutoField(primary_key=True, serialize=False)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comentario',
            fields=[
                ('codComentario', models.AutoField(primary_key=True, serialize=False)),
                ('comentario', models.TextField(max_length=500)),
                ('calificacion', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('establecimiento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.establecimiento')),
                ('turista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comentarios_turista', to='users.turista')),
            ],
        ),
        migrations.CreateModel(
            name='Alojamientos',
            fields=[
                ('establecimiento_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='users.establecimiento')),
                ('codCategoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.categoria')),
                ('codTipoAlojamiento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.tipoalojamiento')),
                ('servicios', models.ManyToManyField(related_name='alojamientos', to='users.tiposervicio')),
            ],
            bases=('users.establecimiento',),
        ),
        migrations.CreateModel(
            name='Comercio',
            fields=[
                ('establecimiento_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='users.establecimiento')),
                ('codTipoComercio', models.ManyToManyField(related_name='TipoComercio', to='users.tipocomercio')),
            ],
            bases=('users.establecimiento',),
        ),
        migrations.CreateModel(
            name='Gastronomia',
            fields=[
                ('establecimiento_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='users.establecimiento')),
                ('tipos_comida', models.ManyToManyField(related_name='Gastronomia', to='users.tipocomida')),
                ('tipos_gastronomia', models.ManyToManyField(related_name='Gastronomia', to='users.tipogastronomia')),
                ('tipos_pref_alimentaria', models.ManyToManyField(related_name='Gastronomia', to='users.tipoprefaliment')),
                ('tipos_servicio_gastronomico', models.ManyToManyField(related_name='Gastronomia', to='users.tiposervgastro')),
            ],
            bases=('users.establecimiento',),
        ),
    ]
