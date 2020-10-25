<?php
/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

namespace solicitud\tipos;

defined('_inc') or exit;

/**
 * Tipo de solicitud concreta que representa el acceso a recursos (CSS, JS, imágenes, etc.) de la aplicación.
 */
class recurso extends \solicitud {
    protected $ruta=null;

    /**
     * Ejecuta la solicitud.
     * @return \solicitud\tipos\recurso
     */
    public function ejecutar() {
        //Enviar archivos de recursoss de la aplicación

        $ruta=$this->obtenerRuta();

        if(!file_exists($ruta)||is_dir($ruta)) return $this->error();

        $mime=\mime($ruta);
        header('Content-Type: '.$mime.'; charset=utf-8',true);       
        
        $f=fopen($ruta,'r');
        fpassthru($f);
        fclose($f);
        
        return $this;
    }

    /**
     * Determina si los parámetros dados a una solicitud de este tipo.
     * @var string $url URL
     * @var object $parametros Parámetros de la solicitud.
     * @return bool
     */
    public static function es($url,$parametros) {
        //$url se asume validado y sanitizado por el enrutador
        return preg_match('#^aplicacion/(.+)#',$url);
    }

    /**
     * Devuelve la ruta local al recurso solicitado.
     * @return string
     */
    public function obtenerRuta() {
        if(!$this->ruta) {
            preg_match('#^aplicacion/(.+)#',$this->url,$coincidencias);
            $recurso=$coincidencias[1];

            //Remover versión
            $recurso=preg_replace('/-[0-9]+\.(css|js)$/','.$1',$recurso);

            //Validar que no haya slido del directorio de la aplicación
            $dir=realpath(_raizAplicacion);
            $ruta=realpath($dir.'/'.$recurso);
            if(substr($ruta,0,strlen($dir))==$dir) $this->ruta=$ruta;
        }
        return $this->ruta;
    }

    /**
     * Establece el recurso a devolver. Nota: Este valor no será sanitizado, no debe pasarse un valor obtenido desde el cliente.
     * @var string $ruta Ruta local al archivo.
     * @return \solicitud\tipos\recurso
     */
    public function establecerRuta($ruta) {
        $this->ruta=$ruta;
        return $this;
    }
}