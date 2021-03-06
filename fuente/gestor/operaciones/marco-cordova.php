<?php
/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

//Script de PRUEBA para mostrar vistas embebibles en el marco del editor

define('_inc',1);

include(__DIR__.'/../funciones.php');
include(_raizGlobal.'desarrollo/servidor/foxtrot.php');

prepararVariables();

$json=file_get_contents($rutaJson);

$html=file_get_contents($rutaHtml);
?>
<!doctype html>
<html lang="es">
  <head>
    <base href="<?=\foxtrot::obtenerUrl()?>">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="recursos/css/foxtrot.css">
    <link rel="stylesheet" href="recursos/css/tema-<?=$aplicacion->tema?>.css">
    <link rel="stylesheet" href="aplicacion/recursos/css/estilos.css">
    <link rel="stylesheet" href="<?=$urlCss?>">
    <title>Marco del editor de vistas</title>
  </head>
  <body>
    <?=$html?>
    <script src="cliente/foxtrot.js"></script>
    <script>
    //Establecer parámetros para vistas embebibles
    localStorage.setItem("_urlBase","<?=\foxtrot::obtenerUrl()?>");
    //Redireccionar a la vista
    window.location.href="<?=\foxtrot::obtenerUrl()?>aplicaciones/<?=$nombreApl?>/cliente/vistas/<?=$nombreVista?>.html";
    </script>
  </body>
</html>