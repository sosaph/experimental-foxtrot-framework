/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

/**
 * Métodos anexados a la gestión de la interfaz.
 */
(function() {
    var dialogoAbierto=null;

    var docKeyDn=function(ev) {
        if(ev.which==27) {
            //ESC
            ui.cerrarDialogo(dialogoAbierto);
            ev.preventDefault();
            ev.stopPropagation();
        }
    };

    var removerEventos=function() {
        ui.obtenerDocumento().removerEvento("keydown",docKeyDn);
    };

    /**
     * Construye un cuadro de diálogo.
     * @param {Object} parametros - Parámetros.
     * @param {(string|Node|Element)} [parametros[].cuerpo] - Elemento o HTML a incluir en el cuerpo.
     * @param {Object[]} [parametros[].opciones] - Botones de acción a generar.
     * @param {string} [parametros[].opciones[].etiqueta] - Etiqueta del botón.
     * @param {string} [parametros[].opciones[].clase] - Clase CSS del botón.
     * @param {boolean} [parametros[].opciones[].predeterminado] - Determina si es la acción predeterminada.
     * @param {function} [parametros[].retorno] - Función de retorno. Recibirá como parámetro el índice del botón, o NULL si fue cancelado.
     * @param {boolean} [parametros[].mostrarCerrar=false] - Determina si se debe mostrar la X para cancelar el diálogo.
     * @param {boolean} [parametros[].eliminar=false] - Determina si el diálogo se debe eliminar luego de cerrado.
     * @returns {Object}
     */
    ui.construirDialogo=function(parametros) {
        var doc=ui.obtenerDocumento();

        var elem=doc.crear("<div class='foxtrot-dialogo oculto'><div class='dialogo-cuerpo'><div class='dialogo-contenido'></div><div class='dialogo-opciones'></div></div></div>")
            .anexarA(doc.body);

        parametros=Object.assign({
            cuerpo:null,
            opciones:null,
            retorno:null,
            mostrarCerrar:false,
            eliminar:false,
            padreAnterior:null
        },parametros);

        if(parametros.mostrarCerrar) {
            var cerrar=doc.crear("<a href='#' class='dialogo-x'></a>");
            elem.querySelector(".dialogo-cuerpo").anexar(cerrar);
            cerrar.evento("click",function(ev) {
                ev.preventDefault();
                ui.cerrarDialogo(dialogoAbierto,null);
            });
        }

        var cuerpo=elem.querySelector(".dialogo-contenido");
        if(typeof parametros.cuerpo==="string") {
            cuerpo.html(parametros.cuerpo);
        } else {
            //Almacenar la ubicación anterior del contenido para poder restaurarlo
            parametros.padreAnterior=parametros.cuerpo.parentNode;
            cuerpo.anexar(parametros.cuerpo);
        }

        if(parametros.opciones) {
            var contenedor=elem.querySelector(".dialogo-opciones");

            parametros.opciones.forEach(function(boton,i) {
                var btn=doc.crear("<a href='#' class='btn'>")
                    .html(boton.etiqueta)
                    .dato("indice",i)
                    .evento("click",function(ev) {
                        ev.preventDefault();
                        ui.cerrarDialogo(dialogoAbierto,this.dato("indice"));
                    })
                    .evento("keydown",function(ev) {
                        if(ev.which==13) {
                            //Enter
                            ev.preventDefault();
                            ev.stopPropagation();
                            ui.cerrarDialogo(dialogoAbierto,this.dato("indice"));
                        }
                    })
                    .anexarA(contenedor);

                if(typeof boton.predeterminado!=="undefined"&&boton.predeterminado) btn.agregarClase("predeterminado");

                if(typeof boton.clase==="string") btn.agregarClase(boton.clase);
            });
        }

        return {
            elem:elem,
            param:parametros
        };
    };

    /**
     * Abre un diálogo construido con construirDialogo().
     * @param {Object} dialogo 
     */
    ui.abrirDialogo=function(dialogo) {
        if(dialogoAbierto) this.cerrarDialogo(dialogoAbierto,null,true);
        dialogoAbierto=dialogo;

        ui.animarAparecer(dialogo.elem);

        var btn=dialogo.elem.querySelector(".predeterminado");
        if(btn) btn.focus();

        //Eventos
        ui.obtenerDocumento().evento("keydown",docKeyDn);

        return ui;
    };

    /**
     * Cierra un diálogo construido con construirDialogo().
     * @param {Object} dialogo - Diálogo.
     * @param {number} [opcion=null] - Número de opción que cierra el diálogo, o NULL.
     * @param {boolean} [omitirAnimacion=false] - Si es true, ierra el diálogo inmediatamente.
     * @param {boolean} [eliminar] - Eliminar el diálogo luego de cerrar. Si se omite, se tomará de la configuración del diálogo.
     */
    ui.cerrarDialogo=function(dialogo,opcion,omitirAnimacion,eliminar) {
        if(typeof opcion==="undefined") opcion=null;
        if(typeof omitirAnimacion==="undefined") omitirAnimacion=false;
        if(typeof eliminar==="undefined") eliminar=dialogo.param.eliminar;

        removerEventos();

        if(dialogo.param.retorno) dialogo.param.retorno(opcion);

        var fn=function(dialogo,eliminar) {
            return function() {
                if(eliminar) ui.eliminarDialogo(dialogo);
            };
        }(dialogo,eliminar);

        if(omitirAnimacion) {
            fn();
        } else {
            ui.animarDesaparecer(dialogo.elem,fn);
        }

        return ui;
    };

    /**
     * Elimina o destruye un diálogo construido con construirDialogo().
     * @param {Object} dialogo 
     */
    ui.eliminarDialogo=function(dialogo) {
        //Restaurar contenido a su ubicación original
        if(dialogo.padreAnterior) dialogo.padreAnterior.anexar(dialogo.elem.querySelectorAll(".dialogo-contenido>*"));

        dialogo.elem.remover();

        return ui;
    };

    /**
     * Muestra un diálogo de alerta o información (equivalente a alert()).
     * @param {string} mensaje - Mensaje. Admite HTML.
     * @param {function} [funcion] - Función de retorno.
     * @param {string} [etiquetaBoton="Aceptar"] - Etiqueta del botón.
     */
    ui.alerta=function(mensaje,funcion,etiquetaBoton) {
        if(typeof funcion==="undefined") funcion=null;
        if(typeof etiquetaBoton==="undefined") etiquetaBoton="Aceptar";

        //TODO Integración con el plugin de Cordova de Foxtrot
        //TODO Integración con el cliente de escritorio

        ui.abrirDialogo(ui.construirDialogo({
            cuerpo:mensaje,
            retorno:function(resultado) {
                if(funcion) funcion();
            },
            opciones:[{
                etiqueta:etiquetaBoton,
                clase:"btn-primary",
                predeterminado:true
            }],
            eliminar:true
        }));

        return ui;
    };
    
    /**
     * Muestra un diálogo de confirmación.
     * @param {string} mensaje - Mensaje. Admite HTML.
     * @param {function} [funcion] - Función de retorno. Recibirá un parámetro con la respuesta (true, false o null si fue cancelado).
     * @param {boolean} [cancelar=false] - Mostrar opción "Cancelar".
     * @param {string} [etiquetaSi="Si"] - Etiqueta del botón afirmativo.
     * @param {string} [etiquetaNo="No"] - Etiqueta del botón negativo.
     * @param {string} [etiquetaCancelar="Cancelar"] - Etiqueta del botón de cancelar.
     */
    ui.confirmar=function(mensaje,funcion,cancelar,etiquetaSi,etiquetaNo,etiquetaCancelar) {
        if(typeof funcion==="undefined") funcion=null;
        if(typeof cancelar==="undefined") cancelar=false;
        if(typeof etiquetaSi==="undefined") etiquetaSi="Si";
        if(typeof etiquetaNo==="undefined") etiquetaNo="No";
        if(typeof etiquetaCancelar==="undefined") etiquetaCancelar="Cancelar";

        //TODO Integración con el plugin de Cordova de Foxtrot
        //TODO Integración con el cliente de escritorio

        var botones=[
            {
                etiqueta:etiquetaSi,
                clase:"btn-primary",
                predeterminado:true
            },
            {
                etiqueta:etiquetaNo,
                clase:"btn-secondary"
            }
        ];
        
        if(cancelar) botones.push({
                etiqueta:etiquetaCancelar,
                clase:"btn-secondary"
            });

        ui.abrirDialogo(ui.construirDialogo({
            cuerpo:mensaje,
            retorno:function(resultado) {
                var resultado=null;
                if(resultado===0) resultado=true;
                if(resultado===1) resultado=false;
                //cancelado (ESC o botón 2) => null
                if(funcion) funcion(resultado);
            },
            opciones:botones,
            eliminar:true
        }));

        return ui;
    };
})();
