(function(){
	const d = document;
	const popoverTriggerList = d.querySelectorAll('[data-bs-toggle="popover"]');
	const popoverList = [...popoverTriggerList].map(e => new bootstrap.Popover(e));

	const $confirmar = d.getElementById('confirmar-modal');
	const $cargaDocente = document.getElementById('modal-cargaDocente');

	const confirmarAsignacion = new bootstrap.Modal($confirmar, {});
	const modalCargaDocente = new bootstrap.Modal($cargaDocente, {});



	const $botonConfirmar = d.getElementById('confirmar-asignar-uc');
	const $botonCancelar = d.getElementById('cancelar-asignar-uc');
	const $cerrarModal = d.getElementById('cerrar-modal');

	let docenteSeleccionado = null;
	let unidadSeleccionada = null;
	let sedeSeleccionada = null;


	function asignar(cedula_doc, codigo_uc) {
		const $carrera = d.getElementById('nombre-carrera');
		const codigo = $carrera.textContent.split(' ')[0];

		const params = new URLSearchParams({
			cedula_doc,
			codigo,
			codigo_uc
		});


		const url = `/docente/carga`;
		const options = {
			method: 'POST',
			body: params
		}

		fetch(url, options)
			.then(response => response.json())
			.then(data => {
				if(data.error) {
					throw data.mensaje;
				}

				mostrarNotificacion({
					error: false,
					mensaje: data.mensaje
				});

				unidadSeleccionada.classList.add('table-success');
				unidadSeleccionada = null;
			})
			.catch(error => mostrarNotificacion({ error: true, mensaje: error }));
	}


	const formatearTrayecto = trayecto => trayecto === '0' ? 'Inicial' :
		trayecto === '1' ? 'Primero' :
		trayecto === '2' ? 'Segundo' :
		trayecto === '3' ? 'Tercero' :
		trayecto === '4' ? 'Cuarto' : 'Quinto';


	function asignarUnidad() {
		const $nombreDocente = d.getElementById('nombre-docente');
		const $nombreUC = d.getElementById('nombre-unidad');

		removerAnidados($nombreDocente);
		removerAnidados($nombreUC);

		$nombreDocente.appendChild(
			elt('p', {}, `Docente: ${docenteSeleccionado.children[1].textContent}`)
		)

		$nombreUC.appendChild(
			elt('p', {}, `Unidad Curricular: ${unidadSeleccionada.children[2].textContent}`)
		);

		confirmarAsignacion.show();
	}


	function confirmar(event) {
		const cedula = docenteSeleccionado.children[2].textContent;
		const codigo_uc = unidadSeleccionada.children[1].textContent;


		asignar(cedula, codigo_uc);

		confirmarAsignacion.hide();
	}

	function cancelar(event) {
		unidadSeleccionada.classList.remove('table-secondary');
		unidadSeleccionada = null;
	}

	function rellenarTablaDocente(codigoSede) {
		const infoSedes = data[0];
		const $tablaDocentes = d.getElementById('tabla-docentes');
		const docentes = infoSedes[codigoSede].docentes.slice(0);

		const rows = docentes.map((docente, index) => elt('tr', { className: 'text-nowrap', onclick: e => docenteOnClick(e.target.parentNode) },
			elt('td', {}, `${index + 1}`),
			elt('td', {}, `${docente.apellidos_doc} ${docente.nombres_doc}`),
			elt('td', {}, `${docente.cedula_doc}`),
			elt('td', {},
				elt('a', { href: '#', className: 'ver-carga card-link' }, 'Ver perfil')
			)
		));

		removerAnidados($tablaDocentes);
		rows.forEach(row => $tablaDocentes.appendChild(row));

		const verCarga = d.getElementsByClassName('ver-carga');
		for(const $verCarga of verCarga) {
			$verCarga.onclick = event => {
				event.preventDefault();
				buscarCarga(event.target.parentNode.parentNode);
			}
		}
	}

	function rellenarTablaUnidades() {
		const unidades = data[1].unidades.slice(0);
		const $tablaUnidades = d.getElementById('tabla-unidades');
		const rows = unidades.map((unidad, index) => elt('tr', { className: `text-nowrap unidadCurr ${unidad.asignada ? 'tabla-success' : 'no-asignada'}`, onclick: event => unidadOnClick(event.target.parentNode) },
			elt('th', {}, `${index + 1}`),
			elt('td', {}, `${unidad.codigo_uc}`),
			elt('td', {}, `${unidad.nombre_uc}`),
			elt('td', {}, `${unidad.trayecto}`)
		));

		removerAnidados($tablaUnidades);
		rows.forEach($row => $tablaUnidades.appendChild($row));
	}


	function sedeOnClick($sede) {
		$sede.classList.toggle('table-secondary');
		if($sede.classList.contains('table-secondary')) {
			if(sedeSeleccionada !== null) {
				sedeSeleccionada.classList.remove('table-secondary');
			}

			sedeSeleccionada = $sede;

			let codigoSede = sedeSeleccionada
				.children[1]
				.textContent;

			rellenarTablaDocente(codigoSede);
		}
		else
			sedeSeleccionada = null;
	}


	function unidadOnClick($unidad) {
		$unidad.classList.toggle('table-secondary');
		if($unidad.classList.contains('table-secondary')) {

			if(unidadSeleccionada !== null)
				unidadSeleccionada.classList.remove('table-secondary');

			unidadSeleccionada = $unidad;

			if(unidadSeleccionada !== null && docenteSeleccionado !== null) {
				asignarUnidad();
			}
		}
		else {
			unidadSeleccionada = null;
		}
	}

	function docenteOnClick($docente) {
		$docente.classList.toggle('table-secondary');
		if($docente.classList.contains('table-secondary')) {

			if(docenteSeleccionado !== null)
				docenteSeleccionado.classList.remove('table-secondary');

			docenteSeleccionado = $docente;


			if(unidadSeleccionada !== null && docenteSeleccionado !== null) {
				asignarUnidad();
			}
		}
		else {
			docenteSeleccionado = null;
		}
	}

	const mostrarCargaDocente = (carga, $dom) => {
		const $cuerpo = d.getElementById('cuerpo-tablaCargaModal');
		const $aceptar = document.getElementById('aceptar-modalCargaDocente');
		const nombreDocente = $dom.children[1].textContent;

		removerAnidados($cuerpo);

		let numero = 1;
		const $filas = carga.map(unidad => elt('tr', {},
			elt('th', {}, `${numero++}`),
			elt('td', {}, `${unidad.codigo_uc}`),
			elt('td', {}, `${unidad.nombre_uc}`),
			elt('td', {}, `${formatearTrayecto(unidad.trayecto)}`)
		));

		for(const $fila of $filas) {
			$cuerpo.appendChild($fila);
		}
		modalCargaDocente.show();

		$aceptar.onclick = e => modalCargaDocente.hide();
	}

	const buscarCarga = async($dom) => {
		const cedula = $dom.children[2].textContent;
		const url = `/docente/${cedula}/perfil`;

		fetch(url)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.mensaje;

				return data.perfilDocente;
			})
			.then(carga => mostrarCargaDocente(carga, $dom))
			.catch(error => mostrarNotificacion({ error: true, mensaje: error }));
	}



	window.addEventListener('DOMContentLoaded', () => {
		rellenarTablaUnidades();




		const asignadas = d.getElementsByClassName('asignada');
		for(let $asignada of asignadas) {
			$asignada.className = 'asignada table-success';
		}

		const sedes = d.getElementsByClassName('sede');
		for(const $sede of sedes) {
			$sede.onclick = event => sedeOnClick(event.target.parentNode);
		}

		$botonConfirmar.addEventListener('click', confirmar);
		$botonCancelar.addEventListener('click', cancelar);
		$cerrarModal.addEventListener('click', cancelar);
	})
})();