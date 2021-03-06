/**
 * Copyright, 2020, Gabriel Quagliano. Bajo licencia Apache 2.0.
 * 
 * @author Gabriel Quagliano - gabriel.quagliano@gmail.com
 * @version 1.0
 */

/**
 * @external Node
 */

/**
 * @external EventTarget
 */

/**
 * @external NodeList
 */

/**
 * @external Object
 */

/**
 * @external HTMLDocument
 */

/**
 * @external Window
 */

/**
 * Extiende los prototipos del DOM.
 * @deprecated
 */
(function() {
    "use strict";

    var id=1,
        almacenMetadatos={};

    ////// Métodos para los elementos del DOM

    /**
     * Devuelve el ID del elemento, inicializandolo si es necesario.
     * @memberof external:Node
     * @returns {number}
     */
    Node.prototype.obtenerId=function() {
        if(util.esIndefinido(this._id)) this._id=id++;
        return this._id;    
    };

    /**
     * Inicializa los metadatos de un elemento del DOM. Trabaja con una instancia de Element (no objetoDom).
     * @memberof external:Node
     */
    Node.prototype.inicializarMetadatos=function() {
        var obj=this.metadatos(this);
        if(!obj.hasOwnProperty("eventos")||!obj.eventos) obj.eventos={};
        if(!obj.hasOwnProperty("valores")||!obj.valores) obj.valores={};
    };

    /**
     * Establece o devuelve matadatos del elemento. Trabaja con un almacén de metadatos común a todos los elementos.
     * @memberof external:Node
     */
    Node.prototype.metadato=function(clave,valor) {
        var id=this.obtenerId();

        if(!almacenMetadatos.hasOwnProperty(id)) almacenMetadatos[id]={};
        var obj=almacenMetadatos[id];

        if(!util.esIndefinido(clave)&&!obj.hasOwnProperty(clave)) obj[clave]=null;

        if(util.esIndefinido(clave)) return obj;

        if(util.esIndefinido(valor)) return obj[clave];

        obj[clave]=valor;
        return this;
    };

    /**
     * Devuelve todos los metadatos del elemento.
     * @memberof external:Node
     */
    Node.prototype.metadatos=function() {
        return this.metadato();
    };

    /**
     * Establece o devuelve datos (dataset) del elemento.
     * @memberof external:Node
     */
    Node.prototype.dato=function(clave,valor) {
        if(!this.dataset) return null; //Algunos nodos pueden no tener dataset (por ejemplo Text)
        if(util.esIndefinido(valor)) return this.dataset[clave];
        this.dataset[clave]=valor;
        return this;
    };

    /**
     * Devuelve todos los datos (dataset) del elemento.
     * @memberof external:Node
     */
    Node.prototype.datos=function() {
        return Object.assign({},this.dataset);
    };

    /**
     * Acceso directo a querySelectorAll(sel).
     * @memberof external:Node
     */
    Node.prototype.buscar=function(sel) {
        return this.querySelectorAll(sel);
    };

    /**
     * Devuelve los elementos que puedan recibir foco. Nótese que devuelve un array (*no NodeList*).
     * @returns {Node[]}
     * @memberof external:Node
     */
    Node.prototype.buscarEnfocables=function() {
        var lista=this
            .querySelectorAll("a,button,input,textarea,select,details,[tabindex]:not([tabindex='-1'])")
            .aArray();
        lista.filter(function(elem) {
            return elem.hasAttribute("disabled");
            //TODO Clase .disabled en el elemento o en su ascendencia
        });
        return lista;
    };

    /**
     * Devuelve los hijos directos del elemento.
     * @memberof external:Node
     * @param {Object} [filtro] - Filtra los elementos resultantes.
     */
    Node.prototype.hijos=function(filtro) {
        var hijos=this.childNodes;
        if(typeof filtro==="undefined") return hijos;
        return hijos.filtrar(filtro);
    };

    /**
     * Devuelve o establece el valor del campo.
     * @memberof external:Node
     */
    Node.prototype.valor=function(valor) {
        var tipo=this.type;
        
        if(tipo=="checkbox"||(tipo=="radio"&&!this.name)) { //Tratar botón de opción sin nombre como un checkbox
            if(util.esIndefinido(valor)) return this.checked;
            this.checked=valor;
            //También asignar/remover atributo para que se refleje en el DOM (necesario, por ejemplo, para el editor)
            if(valor) {
                this.atributo("checked",true);
            } else {
                this.removerAtributo("checked");
            }
            return this;
        }
        
        if(tipo=="radio") {
            var opciones=document.querySelectorAll("[name='"+this.name+"']");
            if(util.esIndefinido(valor)) {
                //Buscar el valor del botón marcado entre los elementos del mismo nombre
                valor=null;
                if(opciones) {
                    for(var i=0;i<opciones.length;i++) {
                        if(opciones[i].checked) {
                            valor=opciones[i].value;
                            break;
                        }
                    }
                }
                return valor;
            } else if(typeof valor==="boolean") {
                //Marcar/desmarcar individualmente
                this.checked=valor;
            } else {
                //Marcar el botón correspondiente entre los elementos del mismo nombre
                if(opciones) {
                    for(var i=0;i<opciones.length;i++) {
                        opciones[i].checked=opciones[i].name==valor;
                    }
                }
                return this;
            }
        }

        if(util.esIndefinido(valor)) return this.value?this.value:"";

        if(valor===null) valor="";

        //En un select, ante un valor vacío se debe seleccionar la primer opción
        if(!valor&&tipo=="select-one") {
            var opcion=null;
            //¿Hay una opción con value=""?
            if(valor==="") opcion=this.querySelector("option[value='']");
            if(!opcion) opcion=this.querySelector("option");
            if(opcion) valor=opcion.value;
        }

        this.value=valor;
        return this;
    };

    /**
     * Agrega los elementos especificados a los elementos de esta instancia.
     * @memberof external:Node
     */
    Node.prototype.anexar=function(elemento) {
        if(typeof elemento==="string") {
            this.anexar(document.crear(elemento));
            return this;
        }

        if(util.esListaDeElementos(elemento)) {
            var t=this;
            elemento.forEach(function(elem) {
                t.appendChild(elem);
            });
            return this;
        }

        this.appendChild(elemento);
        return this;
    };

    /**
     * Agrega los elementos especificados antes del primer hijo de esta instancia.
     * @var {(Node|Element)} elemento - Elemento a anteponer.
     * @returns {Node}
     * @memberof external:Node
     */
    Node.prototype.anteponer=function(elemento) {
        if(typeof elemento==="string") {
            this.anteponer(document.crear(elemento));
            return this;
        }

        if(util.esListaDeElementos(elemento)) {
            var t=this;
            elemento.forEach(function(elem) {
                t.prepend(elem);
            });
            return this;
        }

        this.prepend(elemento);
        return this;
    };

    /**
     * Agrega los elementos especificados a antes de los elementos de esta instancia.
     * @memberof external:Node
     */
    Node.prototype.insertarAntes=function(elemento) {
        if(typeof elemento==="string") {
            this.insertarAntes(document.crear(elemento));
            return this;
        }

        if(util.esListaDeElementos(elemento)) {
            var t=this;
            elemento.forEach(function(elem) {
                t.parentNode.insertBefore(elem,t);
            });
            return this;
        }

        this.parentNode.insertBefore(elemento,this);
        return this;
    };

    /**
     * Agrega los elementos especificados después de los elementos de esta instancia.
     * @memberof external:Node
     */
    Node.prototype.insertarDespues=function(elemento) {
        if(typeof elemento==="string") {
            this.insertarDespues(document.crear(elemento));
            return this;
        }

        if(util.esListaDeElementos(elemento)) {
            var t=this;
            elemento.forEach(function(elem) {
                t.parentNode.insertAfter(elem,t);
            });
            return this;
        }

        if(this.nextSibling) {
            this.parentNode.insertBefore(elemento,this.nextSibling);
        } else {
            this.parentNode.appendChild(elemento);
        }
        
        return this;
    };

    /**
     * Agrega este elemento a los elementos especificados.
     * @memberof external:Node
     */
    Node.prototype.anexarA=function(elemento) {
        //TODO Si elemento es un NodeList, ¿clonar?
        elemento.anexar(this);
        return this;
    };

    /**
     * Agrega este elemento como primer hijo de los elementos especificados.
     * @var {(Node|Element)} elemento - Elemento de destino.
     * @returns {Node}
     * @memberof external:Node
     */
    Node.prototype.anteponerA=function(elemento) {
        //TODO Si elemento es un NodeList, ¿clonar?
        elemento.anteponer(this);
        return this;
    };

    /**
     * Determina si el elemento coincide con el filtro. Todas las propiedades deben coincidir, pero todos fitros con múltiples elementos
     * se evalúan como OR. Los valores de los filtros se evalúan como cadena (no es sensible al tipo).
     * @param {Object} filtro - Filtro.
     * @param {(string|RegExp)} [filtro.clase] - Tiene la(s) clase(s) css. Coincidencia exacta o RegExp.
     * @param {(string|RegExp)} [filtro.nombre] - Atributo name. Coincidencia exacta o RegExp.
     * @param {(string|RegExp)} [filtro.id] - Atributo id. Coincidencia exacta o RegExp.
     * @param {(string|RegExp)} [filtro.etiqueta] - Nombre de tag. Coincidencia exacta o RegExp.
     * @param {(string|RegExp)} [filtro.atributos] - Valor de atributos. Objeto {atributo:valor}. Coincidencia exacta o RegExp.
     * @param {string|string[]} [filtro.propiedades] - Propiedades (readonly, disabled, etc.). Cadena o Array. Coincidencia exacta.
     * @param {(string|RegExp)} [filtro.datos] - Datos (dataset). Objeto {nombre:valor}. Coincidencia exacta o RegExp.
     * @param {(string|RegExp)} [filtro.metadatos] - Metadatos (internos). Objeto. Coincidencia exacta o RegExp.
     * @param {(string|RegExp)} [filtro.tipo] - Tipo de campo {nombre:valor}. Coincidencia exacta o RegExp.
     * @param {(Node|Element)} [filtro.elemento] - Instancia de un nodo o elemento.
     * @param {boolean} [filtro.visible] - Visibilidad. Nótese que un elemento oculto mediande `visibility` u opacidad se considera visible ya que forma parte del DOM.
     * @returns {boolean}
     * @memberof external:Node
     */
    Node.prototype.es=function(filtro) {
        if(typeof filtro==="undefined") return true; //Un filtro indefinido coincide con todo

        var resultado=false;

        function coincide(origen,valor) {
            if(typeof origen!=="string") origen=new Object(origen).toString();
            if(typeof valor!=="string"&&!util.esExpresionRegular(valor)) valor=new Object(valor).toString();
            return (typeof valor==="string"&&origen.toLowerCase()==valor.toLowerCase())||(util.esExpresionRegular(valor)&&valor.test(origen));
        }

        if(filtro.hasOwnProperty("elemento")) {
            resultado=this===filtro.elemento;
        }

        if(filtro.hasOwnProperty("visible")) {
            var esVisible=this.offsetWidth>0||this.offsetHeight>0;
            resultado=filtro.visible==esVisible;
        }

        if(filtro.hasOwnProperty("clase")) {
            if(!this.classList) {
                resultado=false;
            } else {
                if(typeof filtro.clase==="string") {
                    resultado=this.classList.contains(filtro.clase);
                } else if(util.esExpresionRegular(filtro.clase)) {
                    for(var i=0;i<this.classList.length;i++) {
                        if(filtro.clase.test(this.classList[i])) {
                            resultado=true;
                            break;
                        }
                    }
                }
            }
        }

        if(filtro.hasOwnProperty("nombre")) {
            resultado=coincide(this.name,filtro.nombre);
        }

        if(filtro.hasOwnProperty("id")) {
            resultado=coincide(this.id,filtro.id);
        }

        if(filtro.hasOwnProperty("etiqueta")) {
            resultado=coincide(this.nodeName,filtro.etiqueta);
        }

        /*function buscarObjeto(origen,propiedad,objeto) {
            for(var i=0;i<origen.length;i++) {
                for(var j in objeto) {
                    if(!objeto.hasOwnProperty(j)) continue;
                    
                    var v=origen[i],
                        f=objeto[j];
                    if(propiedad) v=v[propiedad];
                    v=v.toLowerCase();

                    if(coincide(v,f)) return true;
                }            
            }
            return false;
        }*/

        function buscarObjeto(origen,propiedad,objeto) {
            for(var i in objeto) {
                if(!objeto.hasOwnProperty(i)||!origen.hasOwnProperty(i)) continue;
                
                var v=origen[i],
                    f=objeto[i];
                if(propiedad) v=v[propiedad];
                v=v.toLowerCase();

                if(coincide(v,f)) return true;
            }
            return false;
        }

        function buscarArray(origen,propiedad,array) {
            for(var i=0;i<origen.length;i++) {
                for(var j=0;j<array.length;j++) {
                    var v=origen[i],
                        f=array[j];
                    if(propiedad) v=v[propiedad];
                    v=v.toLowerCase();

                    if(coincide(v,f)) return true;
                }            
            }
            return false;
        }

        if(filtro.hasOwnProperty("atributos")) {
            resultado=buscarObjeto(this.attributes,"value",filtro.atributos);
        }

        if(filtro.hasOwnProperty("propiedades")) {
            var p=typeof filtro.propiedades==="string"?[filtro.propiedades]:filtro.propiedades;
            resultado=buscarArray(this.attributes,"name",p);
        }

        if(filtro.hasOwnProperty("datos")) {
            resultado=buscarObjeto(this.dataset,null,filtro.datos);
        }

        if(filtro.hasOwnProperty("metadatos")) {
            resultado=buscarObjeto(this.metadatos(),null,filtro.metadatos);
        }

        if(filtro.hasOwnProperty("tipo")) {
            resultado=coincide(this.nodeType,filtro.tipo);
        }

        return resultado;
    };

    /**
     * Determina si el nodo es un campo de formulario.
     * @memberof external:Node
     */
    Node.prototype.esCampo=function() {
        return this.es({
            etiqueta:/(input|select|textarea|button)/i
        });
    };

    /**
     * Busca en la ascendencia el elemento que coincida con el filtro, o devuelve el padre directo si filtro no está definido.
     * @memberof external:Node
     */
    Node.prototype.padre=function(filtro) {
        var elem=this.parentNode,
            coincidencia=false;
        
        if(!elem) return null;

        while(1) {
            if(elem.es(filtro)) {
                coincidencia=true;
                break;
            }
            if(elem==document.body) break;
            elem=elem.parentNode;
            if(!elem) break;
        }

        //Devolver nulo si se estaba filtrando y no hubo coincidencias
        if(typeof filtro!=="undefined"&&!coincidencia) return null;

        return elem;        
    };

    /**
     * Busca en la ascendencia todos los elementos que coincidan con el filtro.
     * @memberof external:Node
     */
    Node.prototype.padres=function(filtro) {
        var resultado=[],
            elem=this.parentNode;

        while(1) {
            if(!elem||elem==document.html) break;
            if(elem.es(filtro)) resultado.push(elem);
            elem=elem.parentNode;
        }

        //TODO Devolver un NodeList
        return resultado;
    };

    /**
     * Agrega una clase css a los elementos. Soporta múltiples clases separadas por espacios.
     * @memberof external:Node
     */
    Node.prototype.agregarClase=function(clase) {
        var t=this;
        clase=clase.split(" ");
        clase.forEach(function(v) {
            v=v.trim();
            if(!v) return;
            t.classList.add(v);
        });
        return this;
    };

    /**
     * Remueve una clase css de los elementos. Soporta RegExp o múltiples clases separadas por espacios.
     * @memberof external:Node
     */
    Node.prototype.removerClase=function(clase) {
        var t=this;

        if(util.esExpresionRegular(clase)) {
            var remover=[];
            this.classList.forEach(function(v) {
                if(clase.test(v)) remover.push(v);
            });
            remover.map(function(v) {
                t.classList.remove(v);
            });
            return this;
        }

        clase=clase.split(" ");
        clase.forEach(function(v) {
            v=v.trim();
            if(!v) return;
            t.classList.remove(v);
        });
        return this;
    };

    /**
     * Alterna una clase css en los elementos. Soporta RegExp o múltiples clases separadas por espacios.
     * @memberof external:Node
     */
    Node.prototype.alternarClase=function(clase) {
        var t=this;

        if(util.esExpresionRegular(clase)) {
            var alternar=[];
            this.classList.forEach(function(v) {
                if(clase.test(v)) alternar.push(v);
            });
            alternar.map(function(v) {
                t.classList.toggle(v);
            });
            return this;
        }

        clase=clase.split(" ");
        clase.forEach(function(v) {
            t.classList.toggle(v);
        });
        return this;
    };

    /**
     * Establece o devuelve el valor de un atributo.
     * @memberof external:Node
     */
    Node.prototype.atributo=function(nombre,valor) {
        var atrib;

        if(util.esIndefinido(valor)) {
            atrib=this.attributes.getNamedItem(nombre);
            return atrib?atrib.value:null;
        }

        atrib=document.createAttribute(nombre);
        atrib.value=valor;
        this.attributes.setNamedItem(atrib);

        return this;
    };

    /**
     * Remueve un atributo.
     * @memberof external:Node
     */
    Node.prototype.removerAtributo=function(nombre) {
        if(!this.attributes.getNamedItem(nombre)) return this;
        this.attributes.removeNamedItem(nombre);
        return this;
    };

    /**
     * Devuelve o asigna una propiedad.
     * @memberof external:Node
     */
    Node.prototype.propiedad=function(nombre,valor) {
        if(util.esIndefinido(valor)) return this[nombre];
        if(valor===null) {
            this[nombre]=false;
            this.removeAttribute(nombre);
        } else {
            this[nombre]=valor;
        }
        return this;
    };

    /**
     * Devuelve un objeto {x,y} con la posición relativa del elemento.
     * @memberof external:Node
     */
    Node.prototype.posicion=function() {
        var posicionamiento=this.estilo("position");
        if(posicionamiento=="fixed") return this.posicionAbsoluta();
        return {
            x: parseFloat(this.offsetLeft),
            y: parseFloat(this.offsetTop)
        };
    };

    /**
     * Devuelve un objeto {x,y} con la posición del elemento según está establecido en sus estilos.
     * @memberof external:Node
     */
    Node.prototype.posicionEstilos=function() {
        var estilos=this.estilos();
        return {
            top: parseFloat(estilos.top),
            bottom: parseFloat(estilos.bottom),
            left: parseFloat(estilos.left),
            right: parseFloat(estilos.right)
        };
    };
    
    /**
     * Devuelve un objeto {x,y} con la posición absoluta del elemento.
     * @memberof external:Node
     */
    Node.prototype.posicionAbsoluta=function() {
        var pos=this.getBoundingClientRect();
        return {
            x: pos.left,
            y: pos.top
        };
    };

    /**
     * Prepara un valor arbitrario para que pueda ser asignado como valor de un estilo css.
     * @param {string} propiedad - Nombre de la propiedad CSS.
     * @param {*} valor - Valor a analizar.
     * @returns {string}
     * @private
     */
    function normalizarValorCss(propiedad,valor) {
        if(propiedad=="zIndex") return parseInt(valor).toString();
        
        //TODO Otras propiedades

        if(typeof valor==="number") return valor.toString()+"px";
        if(typeof valor==="string"&&/^[0-9]+$/.test(valor)) return valor+"px";

        return valor;
    }

    /**
     * Devuelve el valor del estilo, si valor no está definido, o asigna el mismo. Estilo puede ser un objeto para establecer múltiples estilos a la vez.
     * @memberof external:Node
     */
    Node.prototype.estilos=function(estilo,valor) {
        if(util.esIndefinido(estilo)) return getComputedStyle(this);
        
        if(!util.esIndefinido(valor)) {
            if(util.esIndefinido(valor)) return getComputedStyle(this)[estilo];
            this.style[estilo]=normalizarValorCss(estilo,valor);
            return this;
        }

        if(typeof estilo==="string") {
            return getComputedStyle(this)[estilo];
        }

        //Objeto de estilos
        var t=this;
        estilo.porCada(function(clave,valor) {
            t.estilos(clave,valor);
        });

        return this;
    };

    /**
     * Alias de estilos(estilo,valor).
     * @memberof external:Node
     */
    Node.prototype.estilo=function(estilo,valor) {
        return this.estilos(estilo,valor);
    };

    /**
     * Devuelve el ancho del elemento, incluyendo bordes (pero no márgenes). Si el elemento es document, devolverá el ancho de la página. Si el elemento
     * es window, devolverá el ancho de la ventana (viewport).
     * @memberof external:Node
     */
    Node.prototype.ancho=function() {
        if(this===document) return document.body.offsetWidth;
        if(this===window) return window.innerWidth;
        return this.offsetWidth;
    };

    /**
     * Devuelve el alto del elemento, incluyendo bordes (pero no márgenes). Si el elemento es document, devolverá el alto de la página. Si el elemento
     * es window, devolverá el alto de la ventana (viewport).
     * @memberof external:Node
     */
    Node.prototype.alto=function() {
        if(this===document) return document.body.offsetHeight;
        if(this===window) return window.innerHeight;
        return this.offsetHeight;
    };

    /**
     * Devuelve a sí mismo. El único propósito es que pueda llamarse obtener(x) en un elemento tal como si fuera NodeList, ahorrando verificar el tipo primero.
     * @memberof external:Node
     */
    Node.prototype.obtener=function(i) {
        if(i==0) return this;
        return null;
    };

    /**
     * Acceso a innerHTML.
     * @memberof external:Node
     */
    Node.prototype.obtenerHtml=function() {
        return this.innerHTML;
    };

    /**
     * Acceso a innerHTML.
     * @memberof external:Node
     */
    Node.prototype.establecerHtml=function(html) {
        this.innerHTML=html;
        return this;
    };

    /**
     * Acceso a innerText.
     * @memberof external:Node
     * @returns {(Node|Element)}
     */
    Node.prototype.establecerTexto=function(texto) {
        this.innerText=texto;
        return this;        
    };

    /**
     * Acceso a innerText.
     * @memberof external:Node
     * @returns {string}
     */
    Node.prototype.obtenerTexto=function() {
        return this.innerText;
    };

    /**
     * Clona el elemento.
     * @memberof external:Node
     */
    Node.prototype.clonar=function(conEventosDatos) {
        var clon=this.cloneNode(true);

        //TODO conEventosDatos

        return clon;
    };

    /**
     * Elimina el elemento.
     * @memberof external:Node
     */
    Node.prototype.remover=function() {
        if(this.parentNode) this.parentNode.removeChild(this);
        return this;
    };

    /**
     * Desacopla el elemento del DOM (sin eliminarlo).
     * @memberof external:Node
     */
    Node.prototype.desacoplar=function() {
        if(!this.parentNode) return this;
        var elem=this.parentNode.removeChild(this);
        return elem;
    };

    ////// Eventos

    /**
     * Devuelve todos los eventos con las funciones asignadas.
     * @memberof external:EventTarget
     */
    EventTarget.prototype.eventos=function() {
        
    };

    /**
     * @private
     * @param {*} elem 
     * @param {*} nombre 
     * @param {*} funcionInterna 
     * @param {*} funcion 
     * @param {*} captura 
     */
    function establecerEvento(elem,nombre,funcionInterna,funcion,captura) {
        if(typeof captura==="undefined") captura=false;

        //Si nombre es el único parámetro, devolvemos todas las funciones asignadas
        if(util.esIndefinido(funcion)) {
            elem.inicializarMetadatos();
            var meta=elem.metadato("eventos");

            if(!meta||!meta.hasOwnProperty(nombre)) return [];

            var arr=[];
            //Necesitamos solo las funciones del usario, que están en el índice 0 de cada elemento
            meta[nombre].aArray().forEach(function(e) {
                arr.push(e[0]);
            });            
            return arr;
        }

        //Usamos un ID para poder encapsularla pero aún así poder identificar la función para removerla en removerEvento
        if(util.esIndefinido(funcion._id)) funcion._id=id++;

        //Almacenar para poder remover todo con removerEvento
        elem.inicializarMetadatos();
        var meta=elem.metadato("eventos");
        if(!meta.hasOwnProperty(nombre)) meta[nombre]={};
        meta[nombre][funcion._id]=[funcion,funcionInterna]; 

        elem.addEventListener(nombre,funcionInterna,captura);

        return elem;
    }

    /**
     * 
     * @memberof external:EventTarget
     * @param {*} nombre 
     * @param {*} funcion 
     * @param {*} captura 
     */
    EventTarget.prototype.evento=function(nombre,funcion,captura) {
        //funcion puede ser un array para asignar múltiples listeners a la vez
        if(util.esArray(funcion)) {
            var t=this;
            funcion.forEach(function(fn) {
                t.evento(nombre,fn,captura);
            });
            return this;
        }        

        //nombre puede contener múltiples eventos separados por espacios
        if(nombre.indexOf(" ")>0) {
            var t=this;
            nombre.split(" ").forEach(function(n) {
                t.evento(n,funcion,captura);
            });
            return this;
        }

        var t=this,
            fn=function(ev) {
                //this siempre será el elemento al cual se le asignó el evento
                funcion.call(t,ev);
            };

        return establecerEvento(this,nombre,fn,funcion,captura);
    };

    /**
     * Ejecuta todos los controladores asignados a un evento.
     * @memberof external:EventTarget
     * @param {string} nombre - Nombre del evento.
     */
    EventTarget.prototype.ejecutarEvento=function(nombre) {
        var t=this;

        //nombre puede contener múltiples eventos separados por espacios
        if(nombre.indexOf(" ")>0) {
            nombre.split(" ").forEach(function(n) {
                t.ejecutarEvento(n);
            });
            return this;
        }

        this.dispatchEvent(new CustomEvent(nombre,{
            bubbles:true,
            cancelable:true
        }));

        return this;
    };

    /**
     * Establece una función que será invocada cuando el evento suceda en los hijos que coincidan con el filtro. Si estricto es true, sólo se invocará cuando el 
     * elemento coincida con el filtro, pero no cuando se produzca en uno de sus hijos (por defecto es false).
     * @memberof external:EventTarget
     */
    EventTarget.prototype.eventoFiltrado=function(nombre,filtro,funcion,estricto,captura) {
        if(util.esIndefinido(estricto)) estricto=false;
        if(util.esIndefinido(captura)) captura=true;

        //funcion puede ser un array para asignar múltiples listeners a la vez
        if(util.esArray(funcion)) {
            var t=this;
            funcion.forEach(function(fn) {
                t.eventoFiltrado(nombre,filtro,fn,estricto,captura);
            });
            return this;
        }  

        //nombre puede contener múltiples eventos separados por espacios
        if(nombre.indexOf(" ")>0) {
            var t=this;
            nombre.split(" ").forEach(function(n) {
                t.eventoFiltrado(n,filtro,funcion,estricto,captura);
            });
            return this;
        }

        var t=this,
            fn=function(ev) {
                var elemento=null;

                if(estricto) {
                    elemento=ev.path[0];
                    if(!elemento.es(filtro)) return;                    
                } else {
                    //Buscar en ev.path un elemento que coincida con el filtro
                    var elemento=null;
                    for(var i=ev.path.length-1;i>=0;i--) {
                        var elem=ev.path[i];
                        if(elem instanceof Window||elem instanceof Document) continue;
                        //Tomamos la última coincidencia (el elemento más interior)
                        if(elem.es(filtro)) elemento=elem;
                    }
                    if(!elemento) return;
                }

                //this siempre será el elemento en el cual se disparó el evento
                funcion.call(elemento,ev);
            };
            
        return establecerEvento(this,nombre,fn,funcion,captura);
    };

    /**
     * Remueve todos los controladores de eventos asignados.
     * @memberof external:EventTarget
     * @returns {EventTarget}
     */
    EventTarget.prototype.removerEventos=function() {
        this.removerEvento();
        this.removerEvento(null,null,true);
        return this;
    };

    /**
     * 
     * @memberof external:EventTarget
     * @param {*} nombre 
     * @param {*} funcion 
     * @param {boolean} [captura=false] - Si un controlador se registró dos veces, uno con captura y otro sin, cada uno debe ser eliminado por separado.
     */
    EventTarget.prototype.removerEvento=function(nombre,funcion,captura) {
        if(typeof captura==="undefined") captura=false;

        //funcion puede ser un array para remover múltiples listeners a la vez
        if(util.esArray(funcion)) {
            var t=this;
            funcion.forEach(function(fn) {
                t.removerEvento(nombre,fn,captura);
            });
            return this;
        }

        //nombre puede contener múltiples eventos separados por espacios
        if(typeof nombre==="string"&&nombre.indexOf(" ")>0) {
            var t=this;
            nombre.split(" ").forEach(function(n) {
                t.removerEvento(n,funcion,captura);
            });
            return this;
        }

        var meta=this.metadato("eventos"),
            fn=null;

        if(meta) {
            if(util.esIndefinido(nombre)||!nombre) {
                //Remover todos los eventos registrados mediante evento()
                var t=this;
                meta.porCada(function(nombre,arr) {
                    arr.porCada(function(id,ev) {
                        t.removeEventListener(nombre,ev[1],captura);
                    });
                });
                return this;
            }

            if(!meta.hasOwnProperty(nombre)) return this;

            if(util.esIndefinido(funcion)||!funcion) {
                //Remover todos los eventos nombre registrados mediante evento()
                var t=this;
                meta[nombre].porCada(function(id,ev) {
                    t.removeEventListener(nombre,ev[1],captura);
                });
                return this;
            }

            //Buscar la funcion asignada al listener (que difiere de la función del usuario ya que es un contenedor)
            if(util.esIndefinido(funcion._id)) return this;
            var obj=meta[nombre][funcion._id];
            if(typeof obj!=="undefined") fn=obj[1];
        }
        
        if(fn) this.removeEventListener(nombre,fn,captura);

        return this;
    };

    ////// Métodos para NodeList

    /**
     * Filtra los elementos y devuelve un nuevo listado como array (¡no NodeList!).
     * @memberof external:NodeList
     * @param {Object} filtro - Filtro (ver documentación de es().)
     * @param {boolean} negado - Negar el filtro.
     * @returns {Node[]|Element[]}
     */
    NodeList.prototype.filtrar=function(filtro,negado) {
        if(util.esIndefinido(negado)) negado=false;
        var resultado=[];
        this.forEach(function(elem) {
            var coincide=elem.es(filtro);
            if(negado) coincide=!coincide;
            if(coincide) resultado.push(elem);
        });
        return resultado;
    };

    /**
     * Busca en el listado todos los elementos que puedan recibir foco y devuelve un nuevo listado como array (*no NodeList*). Nótese que
     * no se evalúan los elementos del listado, *solo la descendencia*  de cada uno.
     * @memberof external:NodeList
     * @returns {Node[]}
     */
    NodeList.prototype.buscarEnfocables=function() {
        var resultado=[];
        this.forEach(function(elem) {
            var arr=elem.buscarEnfocables();
            resultado=resultado.concat(arr);
        });
        return resultado;
    };

    /**
     * Devuelve un elemento dado su índice, o null.
     * @memberof external:NodeList
     */
    NodeList.prototype.obtener=function(i) {
        if(i<0||i>=this.length) return null;
        return this[i];
    };

    // Métodos de Node y EventTarget que se aplican sobre todos los elementos de la lista

    /**
     * Invoca un método en cada elemento del NodeList.
     * @private
     * @param {*} lista 
     * @param {*} metodo 
     * @param {*} argumentos 
     */
    var aplicar=function(lista,metodo,argumentos) {
        var args=typeof argumentos==="undefined"?[]:Array.from(argumentos);
        lista.forEach(function(elem) {
            elem[metodo].apply(elem,args);
        });
    };

    /**
     * Establece o devuelve matadatos del elemento. Trabaja con un almacén de metadatos común a todos los elementos.
     * @memberof external:NodeList
     */
    NodeList.prototype.metadato=function(clave,valor) {
        aplicar(this,"metadato",arguments);
        return this;
    };

    /**
     * Establece o devuelve datos (dataset) del elemento.
     * @memberof external:NodeList
     */
    NodeList.prototype.dato=function(clave,valor) {
        aplicar(this,"dato",arguments);
        return this;
    };
    
    /**
     * Devuelve o establece el valor del campo.
     * @memberof external:NodeList
     */
    NodeList.prototype.valor=function(valor) {
        aplicar(this,"valor",arguments);
        return this;
    };

    /**
     * Agrega los elementos especificados a los elementos de esta instancia.
     * @memberof external:NodeList
     */
    NodeList.prototype.anexar=function(elemento) {
        aplicar(this,"anexar",arguments);
        return this;
    };

    /**
     * Agrega los elementos especificados antes del primer hijo de esta instancia.
     * @memberof external:NodeList
     */
    NodeList.prototype.anteponer=function(elemento) {
        aplicar(this,"anteponer",arguments);
        return this;
    };

    /**
     * Agrega los elementos especificados a antes de los elementos de esta instancia.
     * @memberof external:NodeList
     */
    NodeList.prototype.insertarAntes=function(elemento) {
        aplicar(this,"insertarAntes",arguments);
        return this;
    };

    /**
     * Agrega los elementos especificados después de los elementos de esta instancia.
     * @memberof external:NodeList
     */
    NodeList.prototype.insertarDespues=function(elemento) {
        aplicar(this,"insertarDespues",arguments);
        return this;
    };

    /**
     * Agrega una clase css a los elementos. Soporta múltiples clases separadas por espacios.
     * @memberof external:NodeList
     */
    NodeList.prototype.agregarClase=function(clase) {
        aplicar(this,"agregarClase",arguments);
        return this;
    };

    /**
     * Remueve una clase css de los elementos. Soporta RegExp o múltiples clases separadas por espacios.
     * @memberof external:NodeList
     */
    NodeList.prototype.removerClase=function(clase) {
        aplicar(this,"removerClase",arguments);
        return this;
    };

    /**
     * Alterna una clase css en los elementos. Soporta RegExp o múltiples clases separadas por espacios.
     * @memberof external:NodeList
     */
    NodeList.prototype.alternarClase=function(clase) {
        aplicar(this,"alternarClase",arguments);
        return this;
    };

    /**
     * Establece o devuelve el valor de un atributo.
     * @memberof external:NodeList
     */
    NodeList.prototype.atributo=function(nombre,valor) {
        aplicar(this,"atributo",arguments);
        return this;
    };

    /**
     * Remueve un atributo.
     * @memberof external:NodeList
     */
    NodeList.prototype.removerAtributo=function(nombre) {
        aplicar(this,"removerAtributo",arguments);
        return this;
    };

    /**
     * Devuelve o asigna una propiedad.
     * @memberof external:NodeList
     */
    NodeList.prototype.propiedad=function(nombre,valor) {
        aplicar(this,"propiedad",arguments);
        return this;
    };

    /**
     * Devuelve el valor del estilo, si valor no está definido, o asigna el mismo. Estilo puede ser un objeto para establecer múltiples estilos a la vez.
     * @memberof external:NodeList
     */
    NodeList.prototype.estilos=function(estilo,valor) {
        aplicar(this,"estilos",arguments);
        return this;
    };

    /**
     * Alias de estilos(estilo,valor).
     * @memberof external:NodeList
     */
    NodeList.prototype.estilo=function(estilo,valor) {
        aplicar(this,"estilo",arguments);
        return this;
    };

    /**
     * Acceso a innerHTML.
     * @memberof external:NodeList
     */
    NodeList.prototype.establecerHtml=function(html) {
        aplicar(this,"establecerHtml",arguments);
        return this;
    };

    /**
     * Acceso a innerText.
     * @memberof external:NodeList
     */
    NodeList.prototype.establecerTexto=function(texto) {
        aplicar(this,"establecerTexto",arguments);
        return this;
    };

    /**
     * Elimina el elemento.
     * @memberof external:NodeList
     */
    NodeList.prototype.remover=function() {
        aplicar(this,"remover",arguments);
        return this;
    };

    /**
     * Desacopla el elemento del DOM (sin eliminarlo).
     * @memberof external:NodeList
     */
    NodeList.prototype.desacoplar=function() {
        aplicar(this,"desacoplar",arguments);
        return this;
    };

    /**
     * 
     * @memberof external:NodeList
     * @param {*} nombre 
     * @param {*} funcion 
     * @param {*} captura 
     */
    NodeList.prototype.evento=function(nombre,funcion,captura) {
        aplicar(this,"evento",arguments);
        return this;
    };

    /**
     * Ejecuta todos los controladores asignados a un evento.
     * @memberof external:NodeList
     * @param {string} nombre - Nombre del evento.
     */
    NodeList.prototype.ejecutarEvento=function(nombre) {
        aplicar(this,"ejecutarEvento",arguments);
        return this;
    };

    /**
     * Establece una función que será invocada cuando el evento suceda en los hijos que coincidan con el filtro. Si estricto es true, sólo se invocará cuando el 
     * elemento coincida con el filtro, pero no cuando se produzca en uno de sus hijos (por defecto es false).
     * @memberof external:NodeList
     */
    NodeList.prototype.eventoFiltrado=function(nombre,filtro,funcion,estricto) {
        aplicar(this,"eventoFiltrado",arguments);
        return this;
    };

    /**
     * Remueve todos los controladores de eventos asignados.
     * @memberof external:NodeList
     * @returns {EventTarget}
     */
    NodeList.prototype.removerEventos=function() {
        aplicar(this,"removerEventos",arguments);
        return this;
    };

    /**
     * 
     * @memberof external:NodeList
     * @param {*} nombre 
     * @param {*} funcion 
     * @param {*} captura 
     */
    NodeList.prototype.removerEvento=function(nombre,funcion,captura) {
        aplicar(this,"removerEvento",arguments);
        return this;
    };

    ////// Métodos de Window

    /**
     * Devuelve el ID del elemento, inicializandolo si es necesario.
     * @function
     * @memberof external:Window
     * @returns {number}
     */
    Window.prototype.obtenerId=Node.prototype.obtenerId;

    /**
     * Inicializa los metadatos de un elemento del DOM. Trabaja con una instancia de Element (no objetoDom).
     * @function
     * @memberof external:Window
     */
    Window.prototype.inicializarMetadatos=Node.prototype.inicializarMetadatos;

    /**
     * Establece o devuelve matadatos del elemento. Trabaja con un almacén de metadatos común a todos los elementos.
     * @function
     * @param {*} clave
     * @param {*} valor
     * @memberof external:Window
     */
    Window.prototype.metadato=Node.prototype.metadato;

    /**
     * Devuelve todos los metadatos del elemento.
     * @function
     * @memberof external:Window
     */
    Window.prototype.metadatos=Node.prototype.metadatos;

    /**
     * Devuelve o asigna una propiedad.
     * @function
     * @param {*} nombre
     * @param {*} valor
     * @memberof external:Window
     */
    Window.prototype.propiedad=Node.prototype.propiedad;

    /**
     * Devuelve el ancho del elemento, incluyendo bordes (pero no márgenes). Si el elemento es document, devolverá el ancho de la página. Si el elemento
     * es window, devolverá el ancho de la ventana (viewport).
     * @function
     * @memberof external:Window
     */
    Window.prototype.ancho=Node.prototype.ancho;

    /**
     * Devuelve el alto del elemento, incluyendo bordes (pero no márgenes). Si el elemento es document, devolverá el alto de la página. Si el elemento
     * es window, devolverá el alto de la ventana (viewport).
     * @function
     * @memberof external:Window
     */
    Window.prototype.alto=Node.prototype.alto;

    ////// Otros métodos útiles

    /**
     * Implementación de forEach en objetos.
     * @memberof external:Object
     */
    Object.prototype.porCada=function(fn) {
        var t=this;
        Object.keys(t).forEach(function(clave) {
            if(typeof fn==="function") fn.call(t,clave,t[clave]);
        });
        return this;
    };

    /**
     * Genera y devuelve un nuevo objeto intercambiando las claves por los valores.
     * @returns {Object}
     * @memberof external:Object
     */
    Object.prototype.intercambiar=function() {
        var obj={};
        Object.entries(this).forEach(function(arr) {
            obj[arr[1]]=arr[0];
        });
        return obj;
    };

    /**
     * Devuelve un array con los valores del objeto (descartando las propiedades).
     * @memberof external:Object
     */
    Object.prototype.aArray=function() {
        return Object.values(this);
    };

    /**
     * Determina si el objeto es un objeto vacío.
     * @memberof external:Object
     */
    Object.prototype.vacio=function() {
        for(var prop in this)
            if(this.hasOwnProperty(prop)) return false;
        return JSON.stringify(this)===JSON.stringify({});
    };

    /**
     * Clona el objeto. El parámetro asignar permite asignar o reemplazar propiedades en la nueva instancia.
     * @memberof external:Object
     */
    Object.prototype.clonar=function(asignar) {
        var nuevo=Object.assign(util.esArray(this)?[]:{},this);
        if(!util.esIndefinido(asignar)) {
            asignar.porCada(function(prop,val) {
                nuevo[prop]=val;
            });
        }
        return nuevo;
    };

    /**
     * Copia las propiedades desde el objeto asignado.
     * @memberof external:Object
     */
    Object.prototype.copiarDe=function(obj,reemplazar) {
        if(util.esIndefinido(reemplazar)) reemplazar=true;
        var t=this;
        if(typeof obj!=="object") return this;
        Object.keys(obj).forEach(function(clave) {
            if(reemplazar||!t.hasOwnProperty(clave)) t[clave]=obj[clave];
        });
        return this;
    };

    /**
     * Devuelve el prototipo del objeto (atajo).
     * @memberof external:Object
     */
    Object.prototype.prototipo=function() {
        return Object.getPrototypeOf(this);
    };

    /**
     * Devuelve el prototipo del objeto (atajo).
     * @memberof external:Object
     */
    Object.prototype.cttr=function() {
        return Object.getPrototypeOf(this).constructor;
    };

    /**
     * Crea un elemento a partir de su representación HTML. Devuelve un nodo o un NodeList según haya uno o más de un elemento en el primer nivel.
     * @memberof external:HTMLDocument
     */
    HTMLDocument.prototype.crear=function(html) {
        //Si html es un nombre de tag, utilizar createElement
        if(!/[^a-z]/.test(html)) return document.createElement(html);

        var div=document.createElement("div");
        div.innerHTML=html.trim();

        if(div.children.length==1) return div.children[0];
        return div.childNodes;
    };

    /** @var {Document} documento - Alias de document. */
    window["documento"]=document;

    /** @var {HTMLBodyElement} cuerpo - Alias de document.body. */
    window["cuerpo"]=document.body;
})();

