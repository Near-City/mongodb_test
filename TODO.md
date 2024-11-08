<!-- - Hacer un componente modal que te pregunte una vez hecho una consulta --> DESCARTADO

- Hacer el menú de elección de parámetros para la búsqueda de indicadores más bonito y fluido
- Hacer que la query se haga de forma mas fluida, a lo mejor quitando el botón y que se ejecute al completar los campos


24/10/2024
- Meter el parámetro de seguridad de CSRF en todas las peticiones HTTP en el backend


30/10/2024
- BUG: Si hay un indicador puesto y se cierra el menú del selector de indicador, deja de actualizarse y hacerse requery con los nuevos polígonos. Esto es porque es ese componente el que controla el hacer querys al backend para el indicador, y si no está abierto, no se ocupa de eso.

- Hacer que se guarde un fichero en el navegador con los datos del tutorial que se ha abierto hasta ahora, como un archivo de sesión, e ir abriendo el tutorial con las cosas que toquen que no ha visto.