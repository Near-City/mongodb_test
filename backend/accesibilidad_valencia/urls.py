from django.urls import path
from . import views

app_name = 'accesibilidad_valencia'

urlpatterns = [
    path('barrios/', views.get_barrios, name='barrios'),
    path('distritos/', views.get_distritos, name='distritos'),
    path('secciones/', views.get_secciones, name='secciones'),
    path('parcelas/', views.get_parcelas, name='parcelas'),
    path('data/', views.get_geojson_data, name='get-geojson-data'),
]
