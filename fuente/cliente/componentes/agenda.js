/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

/**
 * Componente concreto Agenda.
 * @class
 * @extends componente
 */
var componenteAgenda=function() {    
    "use strict";

    this.componente="agenda";

    /**
     * Inicializa la instancia tras ser creada o restaurada.
     */
    this.inicializar=function() {
        if(this.fueInicializado) return this; 
        this.clasePadre.inicializar.call(this);
        return this;
    };

    /**
     * Crea el elemento del DOM para esta instancia (método para sobreescribir).
     */
    this.crear=function() {
        this.elemento=document.crear(""); 
        this.clasePadre.crear.call(this);
        return this;
    };
};

ui.registrarComponente("agenda",componenteAgenda,configComponente.clonar({
    descripcion:"Agenda diaria",
    etiqueta:"Agenda",
    grupo:"Formulario",
    icono:"agenda.png",
    ocultar:true
}));