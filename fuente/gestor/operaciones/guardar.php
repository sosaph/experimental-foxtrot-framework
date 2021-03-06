<?php
/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */ 

//Script de PRUEBA para guardar los datos provenientes del editor

define('_inc',1);

include(__DIR__.'/../funciones.php');
include(_raizGlobal.'desarrollo/servidor/foxtrot.php');

header('Content-Type: text/plain; charset=utf-8',true);

prepararVariables();

$css=$_POST['css'];
$html=$_POST['html'];
$json=$_POST['json'];

$json=formato::formatearJson($json);

if($modo=='embebible') {
    //Si la vista es embebible, se guardan el JSON y el HTML por separado
    file_put_contents($rutaJson,$json);
    file_put_contents($rutaHtml,$html);
} else {
    //Solo debemos reemplazar la variable jsonFoxtrot, que en $html tiene el valor al momento de cargarse en el editor
    $html=reemplazarVarJson($html,$json);

    //Al editar una vista PHP, se está trabajando *con la salida* del código de la vista, por lo tanto debemos restaurar el código PHP
    //TODO Por el momento, solo vamos a restaurar el tag <base>, pero debería diseñarse un mecanismo para que esto no esté fijo aquí
    $html=reemplazarTagBase($html);

    $html=limpiarHtml($html);

    file_put_contents($rutaHtml,$html);
}

file_put_contents($rutaCss,$css);

echo json_encode([
    'estado'=>'ok'
]);