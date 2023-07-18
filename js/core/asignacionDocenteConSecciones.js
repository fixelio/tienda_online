(function(){
	const d = document;

	let docenteSeleccionado = null;
	let unidadSeleccionada = null;

	const $cargaDocente = d.getElementById('modal-cargaDocente');
	const modalCargaDocente = new bootstrap.Modal($cargaDocente, {});

	const formatearTrayecto = trayecto => trayecto === '0' ? 'Inicial' :
		trayecto === '1' ? 'Primero' :
		trayecto === '2' ? 'Segundo' :
		trayecto === '3' ? 'Tercero' :
		trayecto === '4' ? 'Cuarto' : 'Quinto';



	async function asignar($unidad) {
		if(docenteSeleccionado === null) {
			return;
		}

		if($unidad.classList.contains('table-success')) {
			return;
		}

		const cedula_doc = docenteSeleccionado.children[2].textContent;
		const codigo_uc = $unidad.children[1].textContent;
		const trayecto = $unidad.children[3].textContent.toLowerCase();
		const letra = $unidad.children[4].textContent;

		const params = new URLSearchParams({
			cedula_doc,
			codigo_uc,
			trayecto,
			letra
		});

		const options = {
			method: 'POST',
			body: params
		}
		
		const url = `/docente/carga/secciones`;
		fetch(url, options)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data;

				mostrarNotificacion(data);

				$unidad.removeEventListener('click', asignar);
				$unidad.classList.add('table-success');
			})
			.catch(error => mostrarNotificacion(error));
	}


	async function docenteOnClick($docente) {
		$docente.classList.toggle('table-secondary');
		if($docente.classList.contains('table-secondary')) {

			if(docenteSeleccionado !== null)
				docenteSeleccionado.classList.remove('table-secondary');

			docenteSeleccionado = $docente;


			const unidades = await buscarCargaAcademica($docente.children[2].textContent);
			rellenarTabla(unidades);
		}
		else {
			docenteSeleccionado = null;
		}
	}


	async function buscarCargaAcademica(cedula) {
		if(cedula in data === false) {
			return;
		}


		const unidades = [];
		for(const carga of data[cedula]) {
			for(const seccion of carga.secciones) {
				unidades.push({
					codigo_uc: carga.perfil.codigo_uc,
					nombre_uc: carga.perfil.nombre_uc,
					trayecto: formatearTrayecto(carga.perfil.trayecto),
					seccion: seccion,
					asignada: carga.perfil.asignada
				});
			}
		}

		return unidades;
	}

	async function rellenarTabla(unidades) {
		const $cuerpo = d.getElementById('cuerpo');
		const $mensaje = d.getElementById('mensaje-vacio');
		const $tabla = d.getElementById('tabla-unidades');

		removerAnidados($cuerpo);

		unidades.forEach((unidad, indice) => {
			$cuerpo.appendChild(
				elt('tr', { className: `text-nowrap ${unidad.asignada ? 'table-success' : ''}`, onclick: e => asignar(e.target.parentNode) },
					elt('th', {}, `${indice+1}`),
					elt('td', {}, unidad.codigo_uc),
					elt('td', {}, unidad.nombre_uc),
					elt('td', {}, unidad.trayecto),
					elt('td', {}, unidad.seccion)
				)
			);
		});
	}


	const mostrarCargaDocente = (carga, $dom) => {
		const $cuerpo = d.getElementById('cuerpo-tablaCargaModal');
		const $aceptar = d.getElementById('aceptar-modalCargaDocente');
		const nombreDocente = $dom.children[1].textContent;

		removerAnidados($cuerpo);

		const $filas = carga.map((unidad, index) => elt('tr', {},
			elt('th', {}, `${index + 1}`),
			elt('td', {}, `${unidad.codigo_uc}`),
			elt('td', {}, `${unidad.nombre_uc}`),
			elt('td', {}, `${formatearTrayecto(unidad.trayecto)}`),
			elt('td', {}, `${unidad.letra}`),
			elt('td', {},
				elt('a', { href: '#', onclick: e => eliminarCarga(e.target.parentNode.parentNode.parentNode) },
					elt('i', { className: 'bi bi-trash text-danger' }, '')
				)
			),
			elt('span', { className: 'invisible' }, `${unidad.codigo}`),
			elt('span', { className: 'invisible' }, `${$dom.children[2].textContent}`)
		));

		for(const $fila of $filas) {
			$cuerpo.appendChild($fila);
		}
		modalCargaDocente.show();

		$aceptar.onclick = e => modalCargaDocente.hide();
	}


	const buscarCarga = async($dom) => {
		const cedula = $dom.children[2].textContent;
		const url = `/docente/cargaAcademica?cedula=${cedula}`;

		const response = await fetch(url);
		const data = await response.json();

		mostrarCargaDocente(data.cargaDocente, $dom);
	}

	async function eliminarCarga($unidad) {
		const cedula_doc = $unidad.children[7].textContent;
		const codigo = $unidad.children[6].textContent;
		const codigo_uc = $unidad.children[1].textContent;
		const letra = $unidad.children[4].textContent;

		const url = `/docente/${cedula_doc}/carga`;

		const params = new URLSearchParams({
			cedula_doc,
			codigo,
			codigo_uc,
			letra
		});

		const options = {
			method: 'DELETE',
			body: params,
		};

		const response = await fetch(url, options);
		if(!response.ok) {
			return mostrarNotificacion({ error: true, mensaje: 'Ocurrió un error interno.' });
		}

		const data = await response.json();
		mostrarNotificacion(data);
		$unidad.remove();
	}


	window.addEventListener('DOMContentLoaded', () => {
		const docentes = d.getElementsByClassName('docente');
		for(const $docente of docentes) {
			$docente.onclick = event => docenteOnClick(event.target.parentNode);
		}

		const verCarga = d.getElementsByClassName('ver-carga');
		for(const $verCarga of verCarga) {
			$verCarga.onclick = event => {
				event.preventDefault();
				event.stopPropagation();
				buscarCarga(event.target.parentNode.parentNode);
			}
		}
	});
})();