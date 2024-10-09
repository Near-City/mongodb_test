import sys, os

# El nombre de la carpeta de tu proyecto Django.
ApplicationDirectory = 'nearcity'
# El nombre de la configuración de tu proyecto, usualmente el nombre de la carpeta que contiene el archivo settings.py.
ApplicationName = 'nearcity'
# El nombre de la carpeta de tu entorno virtual, ajusta esto a la ubicación real de tu entorno virtual.
VirtualEnvDirectory = 'env'
VirtualEnv = os.path.join(os.getcwd(), VirtualEnvDirectory, 'bin', 'python')

if sys.executable != VirtualEnv:
    os.execl(VirtualEnv, VirtualEnv, *sys.argv)

sys.path.insert(0, os.path.join(os.getcwd(), ApplicationDirectory))
sys.path.insert(0, os.path.join(os.getcwd(), ApplicationDirectory, ApplicationName))
sys.path.insert(0, os.path.join(os.getcwd(), VirtualEnvDirectory, 'bin'))

os.chdir(os.path.join(os.getcwd(), ApplicationDirectory))

# Ajusta 'nearcity.settings' con el nombre de tu archivo de configuraciones de Django.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', ApplicationName + '.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
