/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

 "use strict";

/**
 * @class Componente concreto Columna de tabla.
 */
var componenteColumnaTabla=function() {    
    this.componente="tabla-columna";
    this.encabezadoTemporal=null;

    /**
     * Propiedades de Columna de tabla.
     */
    this.propiedadesConcretas={
        "Columna de tabla":{
            encabezado:{
                etiqueta:"Encabezado",
                adaptativa:false
            },
            encabezadoActivo:{
                etiqueta:"Encabezado activo",
                tipo:"bool",
                adaptativa:false
            },
            encabezadoOrden:{
                etiqueta:"Ordenamiento",
                ayuda:"Muestra el ícono de ordanamiento en el encabezado.",
                tipo:"opciones",
                opciones:{
                    no:"Sin ícono",
                    ascendente:"Ascendente",
                    descendente:"Descendente"
                },
                adaptativa:false
            },
            columna:{
                etiqueta:"Columna",
                ayuda:"Permite almacenar el nombre o cualquier dato que permita identificar a la columna (no tiene efectos en forma automática).",
                adaptativa:false
            }
        },
        "Eventos":{
            clickEncabezado:{
                etiqueta:"Click en encabezado",
                adaptativa:false,
                evento:true
            }
        }
    };

    /**
     * Inicializa la instancia tras ser creada o restaurada.
     */
    this.inicializar=function() {
        if(this.fueInicializado) return this; 

        this.contenedor=this.elemento;

        this.inicializarComponente();
        return this;
    };    

    /**
     * Crea el elemento del DOM para esta instancia (método para sobreescribir).
     */
    this.crear=function() {
        //Nota: Debe usarse el nombre del tag y no <td>
        this.elemento=document.crear("td"); 
        this.crearComponente();
        return this;
    };

    /**
     * Evento `editor`.
     * @returns {Componente}
     */
    this.editor=function() {
        //Mostrar encabezados en el editor
        this.encabezadoTemporal=documento.crear("<div class='foxtrot-editor-temporal foxtrot-encabezado-temporal'>")
            .anexarA(this.elemento);
        var encabezado=this.propiedad("encabezado");
        if(encabezado) this.encabezadoTemporal.establecerHtml(encabezado);
        
        return this.editorComponente();
    };
    
    /**
     * Actualiza el componente tras la modificación de una propiedad.
     */
    this.propiedadModificada=function(propiedad,valor,tamano,valorAnterior) {
        //Actualizar encabezados en el editor
        if(propiedad=="encabezado"&&ui.enModoEdicion()) 
            this.encabezadoTemporal.establecerHtml(valor);

        this.propiedadModificadaComponente(propiedad,valor,tamano,valorAnterior);
        return this;
    };

    /**
     * Genera y devuelve la celda <th> para el encabezado de la tabla.
     * @returns {Node}
     */
    this.generarTh=function() {
        var texto=this.propiedad(null,"encabezado"),
            elem=document.crear("th");            

        elem.establecerHtml(texto);

        return elem;
    };

    /**
     * Genera y devuelve la celda <td> para el cuerpo de la tabla.
     * @param {Object} obj - Objeto a representar (datos de la fila).
     * @param {number} indice - Indice del origen de datos (índice del elemento).
     * @returns {Node}
     */
    this.generarTd=function(obj,indice) {
        var elem=document.crear("td");  
        
        elem.establecerHtml("");

        return elem;
    };
};

ui.registrarComponente("tabla-columna",componenteColumnaTabla,configComponente.clonar({
    descripcion:"Columna de tabla",
    etiqueta:"Columna",
    grupo:"Tablas de datos",
    icono:"columna.png",
    padre:["tabla-fila"]
}));