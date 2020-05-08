/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

 "use strict";

/**
 * Componente concreto Contenedor.
 */
function componenteContenedor() {
    this.componente="contenedor";

    /**
     * Reestablece la configuración a partir de un objeto previamente generado con obtenerParametros().
     */
    this.establecerParametros=function(obj) {
        return this;
    };

    /**
     * Inicializa la instancia tras ser creada o restaurada.
     */
    this.inicializar=function() {
        this.contenedor=this.elemento;
        this.datosElemento.elemento=this.elemento;
        this.datosElemento.contenedor=this.contenedor;
        this.datosElemento.instancia=this;
        this.base.inicializar.call(this);
        return this;
    };
    
    /**
     * Crea el elemento del DOM para esta instancia (método para sobreescribir).
     */
    this.crear=function() {
        this.elemento=document.crear("<div class='container vacio'/>");
        this.establecerId();
        this.inicializar();
        return this;
    };
}
componenteContenedor.prototype=new componente();

var config=util.clonar(configComponente);
config.descripcion="Contenedor";
config.icono="componentes/iconos/contenedor.png";

ui.registrarComponente("contenedor",componenteContenedor,config);

