var Application = {
	DOM: class {
		constructor(params) {
			this.elementos = new Map();

			for(let selector of params) {
				this.elementos.set(selector, document.getElementById(selector));
			}
		}
	}
};

Application.DOM.prototype.get = function(elemento) {
	if(this.elementos.has(elemento)) {
		return this.elementos.get(elemento);
	}
};

Application.DOM.prototype.agregar = function(id, ...children) {
	let elemento = this.elementos.get(id);
	for(let child of children) {
		if(typeof child !== "string") elemento.appendChild(child);
		else elemento.appendChild(document.createTextNode(child));
	}
}

Application.DOM.prototype.remover = function(...params) {
	let data = params.map(id => this.elementos.get(id));

	for(let e of data) {
		while(e.firstChild) {
			e.removeChild(e.firstChild);
		}
	}
}

Application.DOM.prototype.activar = function(...params) {
	for(let id of params) {
		let elemento = this.get(id);
		elemento.disabled = false;
	}
}

Application.DOM.prototype.desactivar = function(...params) {
	for(let id of params) {
		let elemento = this.get(id);
		elemento.disabled = true;
	}
}

Application.DOM.prototype.cambiarInput = function(valor, ...params) {
	for(let id of params) {
		let elemento = this.get(id);
		elemento.value = valor;
	}
};

Application.DOM.prototype.cambiarTexto = function(valor, ...params) {
	for(let id of params) {
		let elemento = this.get(id);
		elemento.innerHTML = valor;
	}
}
