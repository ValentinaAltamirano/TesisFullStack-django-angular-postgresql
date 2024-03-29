from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import random

class Empresario(models.Model):
    idEmpresario = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)
    razonSocial = models.CharField(max_length=255)
    descripcion = models.TextField()
    telefono = models.CharField(max_length=20)

    def __str__(self):
        return self.razonSocial
    
# Modelos de establecimientos

class Pais(models.Model):
    codPais = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255, blank= False)
    def __str__(self):
        return self.nombre


class Provincia(models.Model):
    codProvincia = models.AutoField(primary_key=True)
    codPais = models.ForeignKey(Pais, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255, blank= False)

    def __str__(self):
        return self.nombre

class Ciudad(models.Model):
    codCiudad = models.AutoField(primary_key=True)
    codProvincia = models.ForeignKey(Provincia, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255, blank= False)
    def __str__(self):
        return self.nombre


class TipoEstablecimiento(models.Model):
    codTipoEstablecimiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre


class MetodoDePago(models.Model):
    codMetodoDePago = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
    
class Establecimiento(models.Model):
    codEstablecimiento = models.AutoField(primary_key=True)
    empresario = models.ForeignKey(Empresario, on_delete=models.CASCADE, related_name='establecimientos')
    codCiudad = models.ForeignKey(Ciudad, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)
    calle = models.CharField(max_length=255)
    altura = models.CharField(max_length=255, default='0')
    descripcion = models.TextField(max_length=1000, default='Sin descripcion')
    tipoEstablecimiento = models.ForeignKey(TipoEstablecimiento, on_delete=models.CASCADE)
    telefono = models.CharField(max_length=255)
    web = models.TextField(max_length=255, default='')
    metodos_de_pago = models.ManyToManyField(MetodoDePago, related_name='establecimientos')
    
    def __str__(self):
        return f"{self.nombre} - {self.empresario}"
    

    
# Modelos de alojamientos

class TipoServicio(models.Model):
    codTipoServicio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre

class TipoAlojamiento(models.Model):
    codTipoAlojamiento = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre
    
class Categoria(models.Model):
    codCategoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

class Alojamientos(Establecimiento):
    codTipoAlojamiento = models.ForeignKey(TipoAlojamiento, on_delete=models.CASCADE)
    servicios = models.ManyToManyField(TipoServicio, related_name='alojamientos')
    codCategoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.nombre} ({self.codTipoAlojamiento.nombre})"
    
    
class Imagen(models.Model):
    codImagen = models.AutoField(primary_key=True)
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE, related_name='imagenes',default=0)
    imagen = models.ImageField(upload_to='imagenes_establecimiento/')

class TipoGastronomia(models.Model):
    codTipoGastronomia = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

class TipoServGastro(models.Model):
    codTipoServGastro = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

class TipoComida(models.Model):
    codTipoComida = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

class TipoPrefAliment(models.Model):
    codTipoPrefAliment = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

class Gastronomia(Establecimiento):
    tipos_servicio_gastronomico = models.ManyToManyField(TipoServGastro, related_name='Gastronomia')
    tipos_gastronomia = models.ManyToManyField(TipoGastronomia, related_name='Gastronomia')
    tipos_comida = models.ManyToManyField(TipoComida, related_name='Gastronomia')
    tipos_pref_alimentaria = models.ManyToManyField(TipoPrefAliment, related_name='Gastronomia')

    def __str__(self):
        return self.nombre

class TipoComercio(models.Model):
    codTipoComercio = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    def __str__(self):
        return self.nombre

class Comercio(Establecimiento):
    codTipoComercio = models.ManyToManyField(TipoComercio, related_name='TipoComercio')

    def __str__(self):
        return self.nombre

# las clases para Turista:

# Define el modelo Comentario



# Define el modelo Turista
class ImagenPerfil(models.Model):
    codImagenPerfil = models.AutoField(primary_key=True)
    imagen = models.ImageField(upload_to='imagenes_perfil/')
    
class Turista(models.Model):
    codTurista = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE) 
    codImagenPerfil = models.OneToOneField(ImagenPerfil, on_delete=models.CASCADE, default=random.randint(1, 5)) 
    def __str__(self):
        return f"Turista {self.user.username} - {self.codTurista}"

class Comentario(models.Model):
    codComentario = models.AutoField(primary_key=True)
    titulo = models.TextField(max_length=20, default = '')
    comentario = models.TextField(max_length=300)
    calificacion = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # Rango de calificación de 1 a 5 estrellas
    establecimiento = models.ForeignKey(Establecimiento, on_delete=models.CASCADE)  # Relación con Establecimiento
    fecha = models.DateTimeField(default=timezone.now) 
    turista = models.ForeignKey(Turista, on_delete=models.CASCADE, related_name='comentarios_turista')  # Relación con Turista

    def __str__(self):
        return f"Comentario #{self.codComentario}"

    
       