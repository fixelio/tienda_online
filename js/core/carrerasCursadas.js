(function() {

	const formBuscar = document.querySelector('#form-buscarEstudiante');
	const formGestionar = document.querySelector('#form-gestionar');

	const DOMInfo = document.getElementById('informacion-estudiante');
	const DOMModal = document.getElementById('modal-gestionar-carreras');
	const DOMAgregarCarrera = document.getElementById('agregar-carrera');
	const DOMEditarCarrera = document.getElementById('editar-carrera');
	const DOMCarrerasCursadas = document.getElementById('cuerpo-tabla-pnfCursados');

	const cache = { cedula: '0', codigo: '', agregar: true, filaCarrera: null };

	const modalGestionar = new bootstrap.Modal(DOMModal, {});



	formBuscar.onsubmit = async(e) => {
		e.preventDefault();

		let formData = new FormData(e.target);
		let cedula = formData.get('cedula');

		if(cache.cedula === cedula) {
			return;
		}

		cache.cedula = cedula;
		DOMEditarCarrera.style.display = 'none';

		buscarEstudiante();
	}

	formGestionar.onsubmit = async(e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		formData.set('activo', formData.get('activo') !== null ? 1 : 0);
		formData.set('pasaporte', formData.get('pasaporte') !== null ? 1 : 0);
		formData.set('profesional', formData.get('profesional') !== null ? 1 : 0);

		if(formData.get('pnf') === null) {
			cache.codigo = cache.filaCarrera.children[0].innerText.split(' ')[0];
		}
		else cache.codigo = formData.get('pnf').split(' ')[0];

		gestionarCarrera(formData);
	}


	DOMAgregarCarrera.onclick = async(e) => {
		cache.agregar = true;
		formGestionar.elements[0].disabled = false;
		formGestionar.reset();
		mostrarModal()
	}

	DOMEditarCarrera.onclick = async(e) => {
		cache.agregar = false;
		formGestionar.elements[0].disabled = true;

		const elementos = Array.from(formGestionar.elements).slice(0, formGestionar.elements.length);

		let eltIndex = 0;
		elementos.forEach((e, index) => {
			if(index === 1)
				return;

			let text = cache.filaCarrera.children[index].innerText;

			if(eltIndex <= 3) {
				formGestionar.elements[eltIndex++].value = text;
				return;
			}

			formGestionar.elements[eltIndex++].checked = text === 'Si';
		});

		mostrarModal();
	};


	const components = {
		carreraCursada: (cursado) => elt('tr', { onclick: e => carreraSeleccionada(e.target.parentNode), className: `text-nowrap carrera-cursada-${cursado.activo ? 'activa':'noactiva'}` },
			elt('td', { scope: 'col', className: 'text-nowrap' }, `${cursado.nombre}`),
			elt('td', { scope: 'col' }, `${formatearTrayecto(cursado.trayecto)}`),
			elt('td', { scope: 'col' }, `${cursado.situacion}`),
			elt('td', { scope: 'col' }, `${cursado.turno}`),
			elt('td', { scope: 'col' }, `${cursado.ingreso}`),
			elt('td', { scope: 'col' }, `${cursado.activo ? 'Si' : 'No'}`),
			elt('td', { scope: 'col' }, `${cursado.profesional ? 'Si' : 'No'}`),
			elt('td', { scope: 'col' }, `${cursado.pasaporte ? 'Si' : 'No'}`)
		)
	}



	async function lanzarError(mensaje) {
		mostrarNotificacion({ error: true, mensaje });
	}



	async function buscarEstudiante() {
		const url = `/administrador/estudiante?cedula=${cache.cedula}`;
		const response = await fetch(url);

		if(response.status === 404) {
			lanzarError('Esta cédula de identidad no corresponde a ningún estudiante');
			DOMInfo.style.display = 'none';
			removerAnidados(DOMCarrerasCursadas);
			return;
		}

		const datos = await response.json();
		if(datos.error) {
			lanzarError(datos.mensaje);
			return;
		}

		let { nombres, apellidos } = datos.estudiante;
		let DOMNombres = document.getElementById('nombres-apellidos');

		DOMNombres.innerText = `${apellidos} ${nombres}`;
		DOMInfo.style.display = 'block';

		buscarCarrerasCursadas();
	}


	async function buscarCarrerasCursadas() {
		const url = `/administrador/carreras?cedula=${cache.cedula}`;
		const response = await fetch(url);

		if(response.status === 404) {
			console.error('');
			return;
		}

		const datos = await response.json();
		if(datos.error) {
			mostrarNotificacion({ error: true, mensaje: datos.mensaje });
			return;
		}

		removerAnidados(DOMCarrerasCursadas);

		datos.cursadas.forEach(cursada => {
			DOMCarrerasCursadas.appendChild(components.carreraCursada(cursada));
		});
	}


	async function gestionarCarrera(formData) {
		const params = new URLSearchParams(formData);
		const url = `/administrador/carrera/${cache.cedula}/${cache.codigo}`;
		const options = {
			method: cache.agregar ? 'POST' : 'PATCH',
			body: params
		}

		fetch(url, options)
			.then(response => response.json())
			.then(datos => {
				if(datos.error) {
					throw datos.mensaje;
					return;
				}

				if(!cache.agregar) {
					formGestionar.elements[0].disabled = false;

					const elementos = Array.from(formGestionar.elements).slice(0, formGestionar.elements.length - 1);
					let eltIndex = 2;

					elementos.forEach((e, index) => {
						if(index == 0) {
							return;
						}

						if(cache.filaCarrera.classList.contains('carrera-cursada-activa'))
							cache.filaCarrera.classList.remove('carrera-cursada-activa');
						else cache.filaCarrera.classList.remove('carrera-cursada-noactiva');
						

						let text = index <= 3 ? e.value : e.checked ? 'Si':'No';
						cache.filaCarrera.children[eltIndex++].innerText = text;
						cache.filaCarrera.classList.add(`carrera-cursada-${text === 'Si' ? 'activa':'noactiva'}`);
					});
				}
				else {
					buscarCarrerasCursadas();
				}


				formGestionar.reset();
				modalGestionar.hide();
				mostrarNotificacion({ error: false, mensaje: datos.mensaje });
			})
			.catch(lanzarError);
	}


	async function carreraSeleccionada(fila) {
		fila.classList.toggle('table-secondary');
		if(fila.classList.contains('table-secondary')) {
			DOMEditarCarrera.style.display = 'block';

			if(cache.filaCarrera !== null)
				cache.filaCarrera.classList.remove('table-secondary');
			

			cache.filaCarrera = fila;
		}
		else {
			cache.filaCarrera = null;
			DOMEditarCarrera.style.display = 'none';
		}
	}


	async function mostrarModal() {
		const titulo = document.querySelector('#gestionar-carreras-label');
		titulo.innerText = `${cache.agregar ? 'Agregar':'Modificar'} Carrera`;


		modalGestionar.show();
	}




	const formatearTrayecto = t => t === "0" ? "Inicial" :
		t === "1" ? "Primero" :
		t === "2" ? "Segundo" :
		t === "3" ? "Tercero" :
		t === "4" ? "Cuarto" : "Quinto";


})();