from django.urls import path
# from . import views
from .views import ConfigView, PolygonsView, IndicatorsView, IsocronasView ,GetCSRFTokenView, CarrilBiciView, SearchView, LocsView, FilterPlotsView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView

app_name = 'accesibilidad_valencia'

# urlpatterns = [
#     path('api/barrios/', views.get_barrios, name='barrios'),
#     path('api/distritos/', views.get_distritos, name='distritos'),
#     path('api/secciones/', views.get_secciones, name='secciones'),
#     path('api/parcelas/', views.get_parcelas, name='parcelas'),
#     path('api/data/', views.get_geojson_data, name='get-geojson-data'),
#     path('api/config/', views.get_config, name='get-config')
# ]
urlpatterns = [
    path('api/config/', ConfigView.as_view(), name='config'),
    path('api/polygons/<str:type_code>/', PolygonsView.as_view(), name='polygons'),
    path('api/locs/<str:resource_code>/', LocsView.as_view(), name='locs'),
    path('api/indicators/', IndicatorsView.as_view(), name='indicators'),
    path('api/isocronas/', IsocronasView.as_view(), name='isocronas'),
    path('api/csrf/', GetCSRFTokenView.as_view(), name='csrf'),
    path('api/carrilbici/', CarrilBiciView.as_view(), name='carrilbici'),
    path('api/search/', SearchView.as_view(), name='search'),
    path('api/filter-plots/<str:area_code>/<str:area_id>/', FilterPlotsView.as_view(), name='filterplots'),

]
