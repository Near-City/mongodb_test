from django.urls import path
# from . import views
from .views import ConfigView, PolygonsView, PointsView, IndicatorsView, GetCSRFTokenView
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
    path('api/points/<str:type_code>/', PointsView.as_view(), name='points'),
    path('api/indicators/', IndicatorsView.as_view(), name='indicators'),
    path('api/csrf/', GetCSRFTokenView.as_view(), name='csrf'),
]
