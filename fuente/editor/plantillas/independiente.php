<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <base href="<?=\foxtrot::obtenerUrl()?>">
    <meta name="msapplication-tap-highlight" content="no">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover">
    <link rel="stylesheet" href="recursos/css/foxtrot.css" combinar>
    <link rel="stylesheet" href="recursos/css/{editor_tema}.css" combinar tema>
    <link rel="stylesheet" href="aplicacion/recursos/css/estilos.css" combinar>
    <link rel="stylesheet" href="aplicacion/cliente/vistas/{editor_nombreVista}.css">
    <meta name="generator" content="Foxtrot 7">
  </head>
  <body>
    <div id="foxtrot-cuerpo"></div>
    <script src="cliente/foxtrot.js"></script>
    <script src="aplicacion/cliente/vistas/{editor_nombreVista}.js" controlador></script>
    <script src="aplicacion/cliente/aplicacion.js"></script>
    <script>
    var jsonFoxtrot='{}';
    ui.inicializar("{editor_nombreVista}")
        .establecerJson(jsonFoxtrot)
        .ejecutar();
    </script>
  </body>
</html>