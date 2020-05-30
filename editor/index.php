<?php
/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

define('_inc',1);

include(__DIR__.'/../servidor/foxtrot.php');
foxtrot::inicializar();
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="../recursos/css/foxtrot.css">
    <link rel="stylesheet" href="editor.css">
    <title>Editor de vistas</title>
  </head>
  <body class="foxtrot-editor">

    <div id="foxtrot-barra-principal" class="foxtrot-editor foxtrot-barra-herramientas">
        <button class="btn btn-sm" onclick="editor.abrir()" disabled title="Abrir" ><img src="img/abrir.png"></button>
        <button class="btn btn-sm" onclick="editor.guardar()" title="Guardar"><img src="img/guardar.png"></button>
        <button class="btn btn-sm" onclick="editor.previsualizar()" disabled title="Previsualizar la vista en una nueva ventana (sin guardar los cambios)"><img src="img/previsualizar.png"></button>
        <button class="btn btn-sm" onclick="editor.deshacer()" disabled id="foxtrot-btn-deshacer" title="Deshacer"><img src="img/deshacer.png"></button>
        <button class="btn btn-sm" onclick="editor.rehacer()" disabled id="foxtrot-btn-rehacer" title="Rehacer"><img src="img/rehacer.png"></button>
        <div class="float-right text-nowrap">
            <img src="img/cargando.svg" id="foxtrot-cargando">
            <button class="btn btn-sm" onclick="editor.alternarBordes()" id="foxtrot-btn-alternar-bordes" title="Activar / desactivar bordes"><img src="img/bordes.png"></button>
            <button class="btn btn-sm" onclick="editor.alternarInvisibles()" id="foxtrot-btn-alternar-invisibles" title="Mostrar / ocultar elementos invisibles"><img src="img/ver.png"></button>
            <select class="custom-select" title="Tamaño de pantalla" onchange="editor.tamanoMarco(this.valor())">
                <option value="g">Global</option>
                <option value="xl">Extra grande</option>
                <option value="lg">Grande</option>
                <option value="md">Medio</option>
                <option value="sm">Pequeño</option>
                <option value="xs">Extra pequeño</option>
            </select>
        </div>
    </div>
    <div id="foxtrot-barra-componentes" class="foxtrot-editor foxtrot-barra-herramientas-flotante">
        <div class="foxtrot-asa-arrastre"></div>
        <div class="foxtrot-contenidos-barra-herramientas"></div>
    </div>
    <div id="foxtrot-barra-propiedades" class="foxtrot-editor foxtrot-barra-herramientas-flotante foxtrot-barra-propiedades-vacia">
        <div class="foxtrot-asa-arrastre"></div>
        <div class="foxtrot-contenidos-barra-herramientas">Ningún componente seleccionado</div>
    </div>    

    <!-- Esto es provisorio, hasta que tengamos el gestor de archivos o al menos diálogos de abrir/guardar -->
    <script>
        window.editorListo=function() {
            editor.abrir({
                ruta:"<?=$_GET['vista']?>",
                modo:"<?=$_GET['modo']?$_GET['modo']:'independiente'?>",
                cordova:<?=$_GET['cordova']=='1'?'true':'false'?>
            });
        };
    </script>
    
    <!-- Eventualmente, todo esto estará compilado en un solo script con Closure, y los css combinados en un solo archivo -->

    <script src="../cliente/util.js"></script>
    <script src="../cliente/expresion.js"></script>
    <script src="../cliente/ajax.js"></script>
    <script src="../cliente/dom.js"></script>
    <script src="../cliente/arrastra.js"></script>
    <script src="../cliente/editable.js"></script>
    <script src="../cliente/componente.js"></script>
    <script src="../cliente/controlador.js"></script>
    <script src="../cliente/ui.js"></script>
    
    <script src="../cliente/componentes/contenedor.js"></script>
    <script src="../cliente/componentes/texto.js"></script>
    <script src="../cliente/componentes/imagen.js"></script>
    <script src="../cliente/componentes/boton.js"></script>
    <script src="../cliente/componentes/icono.js"></script>
    <script src="../cliente/componentes/espaciador.js"></script>

    <script src="../cliente/componentes/fila.js"></script>
    <script src="../cliente/componentes/columna.js"></script>
    <script src="../cliente/componentes/form.js"></script>
    <script src="../cliente/componentes/dialogo.js"></script>
    <script src="../cliente/componentes/menu-lateral.js"></script>
    <script src="../cliente/componentes/pestanas.js"></script>
    <script src="../cliente/componentes/pestana.js"></script>
    <script src="../cliente/componentes/deslizable.js"></script>
    <script src="../cliente/componentes/navegacion.js"></script>
    <script src="../cliente/componentes/arbol.js"></script>

    <script src="../cliente/componentes/etiqueta.js"></script>
    <script src="../cliente/componentes/condicional.js"></script>
    <script src="../cliente/componentes/bucle.js"></script>
    <script src="../cliente/componentes/codigo.js"></script>
    <script src="../cliente/componentes/importar.js"></script>

    <script src="../cliente/componentes/campo.js"></script>
    <script src="../cliente/componentes/desplegable.js"></script>
    <script src="../cliente/componentes/buscador.js"></script>
    <script src="../cliente/componentes/checkbox.js"></script>
    <script src="../cliente/componentes/opciones.js"></script>
    <script src="../cliente/componentes/alternar.js"></script>
    <script src="../cliente/componentes/fecha.js"></script>
    <script src="../cliente/componentes/hora.js"></script>
    <script src="../cliente/componentes/agenda.js"></script>
    <script src="../cliente/componentes/menu.js"></script>
    <script src="../cliente/componentes/archivo.js"></script>

    <script src="../cliente/componentes/tabla.js"></script>    
    <script src="../cliente/componentes/tabla-columna.js"></script>
    <script src="../cliente/componentes/tabla-fila.js"></script>
    
    <script src="../cliente/componentes/vista.js"></script>
    
    <script src="editor.js"></script>
    
    <iframe id="foxtrot-marco" src="marco.html"></iframe>
    <div id="foxtrot-menu"></div>
  </body>
</html>