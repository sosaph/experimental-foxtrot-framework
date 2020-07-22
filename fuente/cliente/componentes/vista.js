/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

 "use strict";

/**
 * Componente concreto Vista.
 */
var componenteVista=function() {    
    this.componente="vista";
    this.arrastrable=false;

    this.crear=function() {};

    this.inicializar=function() {
        this.contenedor=this.elemento;
        return this.inicializarComponente();
    };
};

ui.registrarComponente("vista",componenteVista,configComponente.clonar({
    descripcion:"Vista"
}));