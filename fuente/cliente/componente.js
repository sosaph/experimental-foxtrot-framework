/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

"use strict";

/**
 * Componente concreto.
 * @typedef Componente
 */

/**
 * Objeto base de los componentes.
 */
var componente=new function() {
    //Los métodos para sobreescribir en el componente concreto tienen una versión nnnComponente que permiten invocar
    //la funcionalidad por defecto.

    ////Privado
    
    var propiedadesCombinadas=null;

    ////Propiedades

    this.id=null;
    this.selector=null;
    this.componente=null;
    this.nombre=null;
    this.elemento=null;
    this.contenedor=null;
    this.contenidoEditable=false;
    this.elementoEditable=null;
    this.arrastrable=true;
    this.inicializado=false;
    this.nombreVista=null;

    /**
     * Almacen de valores de parámetros.
     */
    this.valoresPropiedades=null;

    /**
     * Propiedades comunes a todos los componentes.
     */
    this.propiedadesComunes={
        "Estilo":{
            //nombre:{
            //    etiqueta
            //    tipo (predeterminado texto|multilinea|opciones|multiple|color|numero|comando|bool)
            //    opciones (objeto {valor:{etiqueta,clase}} cuando tipo=opciones o tipo=multiple)
            //    placeholder
            //    funcion
            //    adaptativa (predeterminado true)
            //    clase
            //}
            color:{
                etiqueta:"Color",
                tipo:"color"
            }
        },
        "Posicionamiento":{
            flotar:{ //TODO ¿Traducción?
                etiqueta:"Alineacion",
                tipo:"opciones",
                opciones:{
                    ninguna:"Ninguna - Predeterminado",
                    izquierda:"Izquierda",
                    derecha:"Derecha"
                    //TODO centro (establece margen izq y der = auto)
                }
            },
            margen:{
                etiqueta:"Margen"
                //TODO Tipo de campo personalizado que permita, por ejemplo, crear los 4 campos para los márgenes
            }
        },
        "Tamaño":{
            ancho:{
                etiqueta:"Ancho"
            },
            anchoMaximo:{
                etiqueta:"Ancho máximo"
            }
        },
        "Texto":{
            alineacion:{
                etiqueta:"Alineación",
                tipo:"opciones",
                opciones:{
                    ninguna:"Ninguna - Heredada",
                    izquierda:"Izquierda",
                    derecha:"Derecha",
                    centro:"Centro",
                    justificado:"Justificado",
                    //TODO
                    //justificadoCentro:"Justificado al centro",
                    //justificadoDerecha:"Justificado a la derecha"
                }
            }
        },
        "Eventos":{
            click:{
                etiqueta:"Click",
                adaptativa:false
            }
        }
    };

    /**
     * Propiedades del componente concreto (a sobreescribir).
     */
    this.propiedadesConcretas=null;

    ////Acceso a propiedades    

    /**
     * Devuelve el ID de la instancia.
     */
    this.obtenerId=function() {
        return this.id;
    };

    /**
     * Devuelve el nombre de la vista a la cual pertenece.
     */
    this.obtenerNombreVista=function() {
        return this.nombreVista;
    };

    /**
     * Asigna el nombre de la vista a la cual pertenece el componente.
     */
    this.establecerNombreVista=function(nombre) {
        this.nombreVista=nombre;
        return this;
    };

    /**
     * Devuelve la instancia de la vista (componente) a la cual pertenece.
     */
    this.obtenerVista=function() {
        return ui.obtenerInstanciaVista(this.nombreVista);
    };

    /**
     * Devuelve el nombre de la instancia.
     */
    this.obtenerNombre=function() {
        return this.nombre;
    };

    /**
     * Devuelve el nombre del tipo de componente.
     * @returns {string}
     */
    this.obtenerTipo=function() {
        return this.componente;
    };

    /**
     * Devuelve el selector para el elemento.
     */
    this.obtenerSelector=function() {
        return this.selector;
    };

    /**
     * Establece el selector para el elemento, actualizando los estilos preexistentes.
     */
    this.establecerSelector=function(nuevo) {
        //TODO Actualizar estilos

        this.selector="#"+nuevo;
        return this;
    };

    /**
     * Devuelve el elemento correspondiente a esta instancia, o uno nuevo si es una nueva instancia.
     */
    this.obtenerElemento=function() {
        if(!this.elemento) this.crear();
        return this.elemento;
    };

    /**
     * Devuelve el elemento correspondiente al contenedor de los hijos de esta instancia.
     */
    this.obtenerContenedor=function() {
        return this.contenedor;
    };

    /**
     * Devuelve un objeto con todos los parámetros de configuración.
     */
    this.obtenerPropiedades=function() {
        return this.valoresPropiedades;
    };

    /**
     * Determina si el componente debe poder arrastrarse para reposicionarse o no.
     */
    this.esArrastrable=function() {
        return this.arrastrable;
    };

    /**
     * Devuelve el componente padre.
     * @returns {(Object|null)}
     */
    this.obtenerPadre=function() {
        return this.padre;
    };

    ////Gestión de la instancia

    /**
     * Determina si un objeto es instancia de un componente.
     */
    Object.prototype.esComponente=function() {
        return this.cttr()==componente.cttr();
    };    

    /**
     * Fabrica una instancia de un componente concreto dada su función.
    */
    this.fabricarComponente=function(fn) {
        //Heredar prototipo
        fn.prototype=new (this.cttr());

        var obj=new fn;

        //Inicializar las propiedades que son objetos (de otro modo, se copiarán las referencias desde el prototipo)
        obj.hijos=[];
        obj.valoresPropiedades={};

        return obj;
    };

    /**
     * Establece el ID del elemento del DOM y actualiza el selector y los estilos si es necesario.
     */
    this.establecerIdElemento=function() {
        if(!this.elemento) return this;

        var id=this.elemento.atributo("id");
        if(!id) {
            if(this.nombre) {
                id=this.nombre;
            } else {
                id="componente-"+this.id;
            }
            this.elemento.atributo("id",id);
        }
        
        this.establecerSelector(id);
    };

    /**
     * Inicializa la instancia (método para sobreescribir).
     */    
    this.inicializar=function() {
        this.inicializarComponente();
    };

    /**
     * Inicializa la instancia (método común para todos los componentes).
     * @param {boolean} [omitirEventos=false] - Si es true, se omitirá la asignación de los eventos predefinidos.
     */ 
    this.inicializarComponente=function(omitirEventos) {
        if(this.inicializado) return this;

        //Las clases css que se mantengan al salir del modo de edición deben ser breves
        this.elemento.agregarClase("componente");

        if(this.contenedor) {
            this.contenedor.agregarClase("contenedor"); //.contenedor hace referencia al elemento que contiene los hijos, a diferencia de
                                                        //.container que es la clase de Bootstrap.
            //if(!this.hijos.length) this.contenedor.agregarClase("vacio");
        }        

        this.establecerId()
            .establecerIdElemento();

        if(typeof omitirEventos==="undefined"||!omitirEventos) this.establecerEventos();
        
        return this;
    };

    /**
     * Crea el elemento del DOM para esta instancia (método para sobreescribir).
     */
    this.crear=function() {
        this.crearComponente();
        return this;
    };

    /**
     * Crea el elemento del DOM para esta instancia.
     */
    this.crearComponente=function() {
        this.establecerId();
        return this;
    };

    /**
     * Elimina el componente (método para sobreescribir).
     */
    this.eliminar=function() {
        this.eliminarComponente();
        return this;
    };

    /**
     * Elimina el componente.
     */
    this.eliminarComponente=function() {
        this.elemento.remover();
        if(this.nombre) delete componentes[this.nombre];
        ui.eliminarInstanciaComponente(this.id);
        return this;
    };

    this.establecerElemento=function(elem) {
        this.elemento=elem;

        this.inicializado=false;
        this.inicializar();

        return this;
    };

    /**
     * Inicializa la instancia en base a su ID y sus parámetros (método para sobreescribir).
     */
    this.restaurar=function() {
        this.restaurarComponente();
        return this;
    };

    /**
     * Inicializa la instancia en base a su ID y sus parámetros.
     */
    this.restaurarComponente=function() {
        this.elemento=ui.obtenerCuerpo().querySelector("[data-fxid='"+this.id+"']");
        if(this.elemento) {
            this.inicializado=false;
            this.inicializar(); 
        }        
        return this;
    };

    /**
     * Establece el ID de la instancia. Si se omite id, intentará configurar el DOM de la instancia con un id previamente asignado (método para sobreescribir).
     */
    this.establecerId=function(id) {
        this.establecerIdComponente(id);
        return this;
    };

    /**
     * Establece el ID de la instancia. Si se omite id, intentará configurar el DOM de la instancia con un id previamente asignado.
     */
    this.establecerIdComponente=function(id) {
        if(typeof id!=="undefined") this.id=id;
        if(this.elemento) this.elemento.dato("fxid",this.id);
        return this;
    };

    /**
     * Establece el nombre de la instancia (método para sobreescribir).
     */
    this.establecerNombre=function(nombre) {
        this.establecerNombreComponente(nombre);
        return this;
    };

    /**
     * Establece el nombre de la instancia.
     */
    this.establecerNombreComponente=function(nombre) {
        if(typeof nombre==="undefined") nombre=null;

        //Eliminar de componentes si cambia el nombre
        if(this.nombre!=nombre) delete componentes[this.nombre];

        this.nombre=nombre;

        //Registrar en window.componentes para acceso rápido
        if(nombre) componentes[nombre]=this;

        //Actualizar ID
        this.establecerIdElemento();

        return this;
    };
    
    /**
     * Actualiza el componente. propiedad puede estar definido tras la modificación de una propiedad (método para sobreescribir).
     */
    this.actualizar=function(propiedad,valor,tamano) {
        this.actualizarComponente(propiedad,valor,tamano);
        return this;
    };

    /**
     * Devuelve los estilos del componente.
     */
    this.obtenerEstilos=function(tamano) {
        var estilos=ui.obtenerEstilos(this.selector,tamano);

        if(!estilos.length) {
            //Inicializar
            ui.establecerEstilosSelector(this.selector,"",tamano);
            estilos=ui.obtenerEstilos(this.selector,tamano);
        }
        
        return estilos[0].estilos;
    };

    /**
     * Valida, corrige y agrega unidades a los valores de propiedades CSS.
     */
    this.normalizarValorCss=function(valor,tipo) {
        if(util.esIndefinido(tipo)) tipo="numerico";

        if(tipo=="numerico") {
            //Agregar unidad a los números (px por defecto)
            if(typeof valor==="number"||/^[0-9]+$/.test(valor)) return valor.toString()+"px";

            //Si es solo números con espacios (por ejemplo margin:10 20), agregar unidades a todos los números (margin:10px 20px)
            if(/^[0-9\s]+$/.test(valor)) {
                valor=valor.split(" ");
                valor.forEach(function(v,i) {
                    if(/^[0-9]+$/.test(v)) valor[i]=v.toString()+"px";
                });
                return valor.join(" ");
            }

            //TODO ¿Otros?
        } else if(tipo=="color") {
            //TODO
        }

        //TODO ¿Otros?

        return valor;
    };
    
    /**
     * Actualiza el componente. propiedad puede estar definido tras la modificación de una propiedad.
     */
    this.actualizarComponente=function(propiedad,valor,tamano) {
        if(util.esIndefinido(valor)) valor=this.propiedad(tamano?tamano:"g",propiedad);
        if(util.esIndefinido(tamano)) tamano=null;

        var estilos=this.obtenerEstilos(tamano);

        if(propiedad=="color") {
            estilos.color=this.normalizarValorCss(valor,"color");
            return this;
        }
        
        if(propiedad=="flotar") {
            var float=null;
            if(valor=="izquierda") float="left";
            else if(valor=="derecha") float="right";

            if(tamano=="g") {
                this.elemento.removerClase(/float-(left|right|none)/);
                if(float) this.elemento.agregarClase("float-"+float);                
            } else {
                this.elemento.removerClase(new RegExp("float-"+tamano+"-.+"));
                if(float) this.elemento.agregarClase("float-"+tamano+"-"+float);
            }
            return this;
        }
        
        if(propiedad=="margen") {
            //TODO Margen izq/der/arr/ab
            estilos.margin=this.normalizarValorCss(valor);
            return this;
        }
        
        if(propiedad=="ancho") {
            estilos.width=this.normalizarValorCss(valor);
            return this;
        }
        
        if(propiedad=="anchoMaximo") {
            estilos.maxWidth=this.normalizarValorCss(valor);
            return this;
        }

        if(propiedad=="alineacion") {
            var opc={
                    izquierda:"left",
                    derecha:"right",
                    centro:"center",
                    justificado:"justify"
                },
                align=opc.hasOwnProperty(valor)?opc[valor]:null;
            if(tamano=="g") {
                this.elemento.removerClase(/text-(left|right|center|justify)/);
                if(align) this.elemento.agregarClase("text-"+align);                
            } else {
                this.elemento.removerClase(new RegExp("text-"+tamano+"-.+"));
                if(align) this.elemento.agregarClase("text-"+tamano+"-"+align);
            }
            return this;
        }

        return this;
    };

    ////Propiedades y parámetros

    /**
     * Establece o devuelve el valor de una propiedad como objeto (sin filtrar por tamaño).
     */
    this.propiedadObj=function(nombre,valor) {
        if(util.esIndefinido(valor)) {
            if(!this.valoresPropiedades.hasOwnProperty(nombre)) return null;
            return this.valoresPropiedades[nombre];
        }

        this.valoresPropiedades[nombre]=valor;
        this.actualizar(nombre,valor);
        return this;
    };

    /**
     * Devuelve la definición de una propiedad.
     */
    this.buscarPropiedad=function(nombre) {
        var props=[this.propiedadesComunes,this.propiedadesConcretas];
        for(var i=0;i<2;i++) {
            for(var grupo in props[i]) {
                if(!props[i].hasOwnProperty(grupo)) continue;
                for(var prop in props[i][grupo]) {
                    if(!props[i][grupo].hasOwnProperty(prop)) continue;
                    if(prop==nombre) return props[i][grupo][nombre];
                }
            }
        }
        return null;        
    };

    /**
     * Establece o devuelve el valor de una propiedad.
     */
    this.propiedad=function(tamano,nombre,valor) {
        if(nombre=="nombre") return;

        //xs y g son sinónmos, ya que en ambos casos los estilos son globales
        if(!tamano||tamano=="xs") tamano="g";

        //Determinar si la propiedad es adaptativa (por defecto, si)
        var adaptativa=true,
            definicion=this.buscarPropiedad(nombre);
        if(definicion&&definicion.hasOwnProperty("adaptativa")) adaptativa=definicion.adaptativa;

        if(util.esIndefinido(valor)) {
            if(!this.valoresPropiedades.hasOwnProperty(nombre)) return null;

            var obj=this.valoresPropiedades[nombre];

            if(!adaptativa) return obj;

            if(obj.hasOwnProperty(tamano)) return obj[tamano];

            var tamanos=["g","sm","md","lg","xl"],
                i=tamanos.indexOf(tamano)+1; //ya sabemos que el tamaño actual no existe, probamos el siguiente
            if(i<0) return null;
            for(;i<tamanos.length;i++) 
                if(obj.hasOwnProperty(tamano)) return obj[tamano];
            
            return null;
        }

        if(adaptativa) {
            if(!this.valoresPropiedades.hasOwnProperty(nombre)) this.valoresPropiedades[nombre]={};
            this.valoresPropiedades[nombre][tamano]=valor;
        } else {
            this.valoresPropiedades[nombre]=valor;
        }

        this.actualizar(nombre,valor,tamano);

        return this;
    };

    /**
     * Devuelve el listado de propiedades ordenadas por grupo con valores.
     */
    this.obtenerListadoPropiedades=function(tamano) {
        if(util.esIndefinido(tamano)) tamano="g";
        var t=this;

        if(!propiedadesCombinadas) {
            propiedadesCombinadas={};

            ["propiedadesComunes","propiedadesConcretas"].forEach(function(v) {
                if(!t[v]) return;
                t[v].forEach(function(grupo,propiedades) {
                    propiedades.forEach(function(nombre,propiedad) {
                        if(!propiedadesCombinadas.hasOwnProperty(grupo)) propiedadesCombinadas[grupo]={};
                                            
                        propiedad.funcion=function(componentes,tamano,prop,valor) {
                            //TODO Selección múltiple
                            componentes.propiedad.call(componentes,tamano,prop,valor);
                        };
                        
                        propiedadesCombinadas[grupo][nombre]=propiedad;
                    });
                });
            });
        }

        propiedadesCombinadas.forEach(function(grupo,propiedades) {
            propiedades.forEach(function(nombre,propiedad) {
                propiedad.valor=t.propiedad(tamano,nombre);
            });
        });

        return propiedadesCombinadas;
    };

    /**
     * Reestablece la configuración a partir de un objeto previamente generado con obtenerPropiedades().
     */
    this.establecerPropiedades=function(obj) {
        if(typeof obj==="undefined") obj={};
        this.valoresPropiedades=obj;
        return this;
    };

    ////Editor de texto WYSIWYG
    
    this.iniciarEdicion=function(pausar) {   
        if(util.esIndefinido(pausar)) pausar=true;

        var elem=this.elementoEditable?this.elementoEditable:this.elemento;
        elem.iniciarEdicion().focus();
        
        if(pausar) {
            //Deshabilitar arrastre en todo el árbol
            this.elemento.pausarArrastreArbol();
            //Deshabilitar otros eventos del editor
            editor.pausarEventos();
        }

        return this;
    };
    
    this.finalizarEdicion=function() {
        var elem=this.elementoEditable?this.elementoEditable:this.elemento;
        elem.finalizarEdicion();

        //Reestablecer eventos
        this.elemento.pausarArrastreArbol(false);
        editor.pausarEventos(false);       

        return this;
    };

    ////Eventos    

    /**
     * Establece los eventos predeterminados.
     */
    this.establecerEventos=function() {
        if(!this.elemento) return this;

        var t=this;

        if(!ui.enModoEdicion()) {
            var asignaciones={
                "click":{}
            };

            asignaciones.forEach(function(evento,config) {
                var metodo=config.hasOwnProperty("metodo")?config.metodo:evento,
                    propiedad=config.hasOwnProperty("propiedad")?config.propiedad:evento;

                t.elemento.evento(evento,function(ev) {
                    t.procesarEvento(evento,propiedad,metodo,ev);
                });
            });
        } else if(this.contenidoEditable) {
            this.elemento.evento("dblclick",function(ev) {
                ev.stopPropagation();
                
                t.iniciarEdicion(false);

                var fn=function(e) {
                    if(e.which==27) {
                        t.finalizarEdicion();
                        ui.obtenerDocumento().removerEvento("keydown",fn);
                        e.preventDefault();
                    }
                };
                ui.obtenerDocumento().evento("keydown",fn);
            });
        }

        this.inicializado=true;

        return this;
    };

    /**
     * Procesa una cadena que representa el manejador de un evento, almacenada en las propiedades del componente.
     * @param {string} nombre - Nombre de la propiedad a leer.
     */
    this.procesarCadenaEvento=function(nombre) {
        var valor=this.propiedad(null,nombre);
        if(!valor||!valor.g) return null;
        
        //Evaluar expresiones, si las contiene

        //Agregar al intérprete el controlador y otros objetos y funciones útiles
        
        var vars={
                ui:ui,
                util:util
            },
            controladores=ui.obtenerInstanciasControladores();

        if(controladores) controladores.forEach(function(nombre,obj) {
            vars[nombre]=obj;
        });

        expresion.establecerVariablesGlobales(vars);

        return expresion.evaluar(valor.g);
    };

    this.procesarEvento=function(nombre,propiedad,metodo,evento) {
        //Almacenar algunos metadatos en el objeto del evento
        evento.nombre=nombre;
        evento.componente=this;

        //Método interno del componente
        if(typeof this[metodo]==="function") this[metodo](evento);

        //Manejador definido por el usuario
        var manejador=this.procesarCadenaEvento(propiedad);
        if(!manejador) return;

        var procesado=true;

        if(typeof manejador==="function") {
            manejador(this,evento);
        } else if(typeof manejador==="string") {
            var vista=ui.obtenerInstanciaVista(this.nombreVista),
                ctl=ui.obtenerInstanciaControlador(vista.obtenerNombreControlador());

            if(manejador.substring(0,9)=="servidor:") {
                //Método del controlador de servidor
                ctl.servidor[manejador.substring(9)]();
            } else if(manejador.substring(0,3)=="ir:") {
                //Navegación
                
                //URL
                //TODO

                //Navegación normal (nombre de vista)
                //TODO

            } else if(manejador.substring(0,6)=="popup:") {
                //Popup

                //URL
                //TODO

                //Nombre de vista
                //TODO

            } else if(manejador.indexOf(":")>0) {
                //Manejador con el formato nombreComponente:valor invocará el método eventoExterno(valor,evento) en el
                //componente. Cada comppnente puede decidir qué hacer con el valor. De esta forma implementamos la navegación
                //en el widget de importación de vista manteniendo loz componentes concretos desacoplados.
                
                //Debemos buscarlo en forma global ya que es por nombre (ui los indiza por ID, TODO debería tener un almacén de vista->componente por nombre)
                var nombre=manejador.substring(0,manejador.indexOf(":")),
                    valor=manejador.substring(manejador.indexOf(":")+1);
                componentes[nombre].eventoExterno(valor,evento);
            } else {
                //Propiedad del controlador
                ctl[manejador](this,evento);
            }
            //El acceso a otras funciones o métodos se puede realizar a través de expresiones que devuelvan funciones
            //Nota: No validamos las propiedades ni tipos antes de invocar las funciones intencionalmente, para que produzcan error. Eventualmente debemos implementar
            //      un control de errores interno, que valide estos casos y arroje errores de Foxtrot.
        } else {
            procesado=false;
        }

        if(procesado) {
            evento.preventDefault();
            evento.stopPropagation();
        }
    };

    /**
     * Recepción de eventos externos (método para sobreescribir).
     * @param {*} valor 
     * @param {Object} evento 
     */
    this.eventoExterno=function(valor,evento) {
    };

    ////Utilidades

    /**
     * Devuelve la configuración del tipo de componente.
     * @returns {Object}
     */
    this.obtenerConfigComponente=function() {
        return ui.obtenerComponentes()[this.componente].config;
    };

    ////Árbol
    
    //La jerarquía estará definida exclusivamente por el DOM, no almacenaremos información de las relaciones entre los componentes en el JSON

    /**
     * Devuelve el componente padre.
     * @returns {Componente}
     */
    this.obtenerPadre=function() {
        var elem=this.elemento.padre({
            clase:"componente"
        });
        if(!elem) return null;
        var comp=ui.obtenerInstanciaComponente(elem);
        return comp;
    };

    /**
     * Devuelve un array de componentes hijos.
     * @returns {Componente[]}
     */
    this.obtenerHijos=function() {
        var hijos=[];
        this.elemento.hijos().forEach(function(elem) {
            hijos.push(ui.obtenerInstanciaComponente(elem));
        });
        return hijos;
    };
    
};

window["componente"]=componente;
