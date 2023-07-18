(function() {
	const DOMBuscarEstudiante = document.querySelector('#buscar-estudiante');
	const DOMInfo = document.getElementById('informacion-estudiante');
	const DOMUnidades = document.getElementById('unidades');
	const DOMIniciar = document.getElementById('iniciar-inscripcion');

	const DOMCarreraCursada = document.getElementById('carrera');
	const DOMTrayecto = document.getElementById('trayecto-inscribir');
	const DOMSeccionActual = document.getElementById('seccion-actual');
	const DOMSeccionNueva = document.getElementById('seccion-nueva');

	const BtnIniciarProceso = document.querySelector('#iniciar-proceso');

	const InputSeccionNueva = document.getElementById('seccion-nueva');
	const InputSeccionActual = document.getElementById('seccion-actual');

	const DOMCantidadNueva = document.getElementById('estudiantes-seccionNueva');
	const DOMCantidadActual = document.getElementById('estudiantes-seccionActual');

	const cache = { cedula: '0', inscribiendo: true };

	const lanzarError = (mensaje) => mostrarNotificacion({ error: true, mensaje });
	const deformatearTrayecto = trayecto => trayecto == "0" ? "Inicial" :
		trayecto == "1" ? "Primero" :
		trayecto == "2" ? "Segundo" :
		trayecto == "3" ? "Tercero" :
		trayecto == "4" ? "Cuarto" : "Quinto";



	DOMBuscarEstudiante.onsubmit = async(e) => {
		e.preventDefault();

		let formData = new FormData(e.target);
		let cedula = formData.get('cedula');

		if(cache.cedula === cedula) {
			return;
		}

		cache.cedula = cedula;

		buscarEstudiante();
	}

	DOMIniciar.onsubmit = async(e) => {
		e.preventDefault();

		if(cache.inscribiendo === false)
			return;

		let formData = new FormData(e.target);
		formData.set('carrera', formData.get('carrera').split(' ')[0]);


		iniciarInscripcion(formData);
	}


	InputSeccionNueva.onchange = buscarEstudiantesSeccionNueva;
	InputSeccionActual.onchange = buscarEstudiantesSeccionActual;


	async function borrarInscripcion() {
		const formData = new FormData();
		formData.set('cedula', cache.cedula);

		const url = `/administrador/inscripcion`;
		const options = {
			method: 'DELETE',
			body: new URLSearchParams(formData)
		}

		fetch(url, options)
			.then(response => response.json())
			.then(async(resultado) => {
				if(resultado.error)
					throw resultado.mensaje;

				mostrarNotificacion({ error: false, mensaje: resultado.mensaje });
				BtnIniciarProceso.innerText = 'Iniciar Proceso';
				BtnIniciarProceso.removeEventListener('click', borrarInscripcion);
				DOMUnidades.style.display = 'none';

				DOMCarreraCursada.disabled = false;
				DOMTrayecto.disabled = false;
				DOMSeccionNueva.disabled = false;

				InputSeccionNueva.value = 'A';
				InputSeccionActual.value = '';

				await buscarEstudiantesSeccionNueva();
				await buscarEstudiantesSeccionActual();
			})
			.catch(error => lanzarError(error));
	}




	async function buscarInscripcion() {
		const url = `/administrador/inscripcion?cedula=${cache.cedula}`;
		const resultado = await fetch(url).then(response => response.json());

		if(resultado.error && resultado.cursada === null) {
			DOMInfo.style.display = 'none';
			DOMUnidades.style.display = 'none';
			lanzarError(resultado.mensaje);
			return;
		}

		const cursada = resultado.cursada;

		DOMInfo.style.display = 'block';
		
		removerAnidados(DOMCarreraCursada);
		DOMCarreraCursada.appendChild(elt('option', { selected: '' }, `${resultado.cursada.nombre}`));

		removerAnidados(DOMTrayecto);
		DOMTrayecto.appendChild(elt('option', { selected: '' }, deformatearTrayecto(cursada.trayecto)));

		DOMCarreraCursada.disabled = resultado.inscripcion;
		DOMTrayecto.disabled = resultado.inscripcion;
		DOMSeccionNueva.disabled = resultado.inscripcion;

		if(!resultado.inscripcion) {
			cache.inscribiendo = true;

			DOMSeccionNueva.value = 'A';
			DOMSeccionActual.value = '';

			DOMCantidadActual.innerText = '0';
			BtnIniciarProceso.innerText = 'Iniciar Proceso';
			BtnIniciarProceso.removeEventListener('click', borrarInscripcion);

			DOMUnidades.style.display = 'none';
			await buscarEstudiantesSeccionNueva();
			return;
		}

		cache.inscribiendo = false;

		BtnIniciarProceso.innerText = 'Cancelar Proceso';
		BtnIniciarProceso.addEventListener('click', borrarInscripcion);

		DOMSeccionNueva.value = '';
		DOMCantidadNueva.innerText = '0';
		fetch(`/administrador/seccion/estudiante?cedula=${cache.cedula}`)
			.then(response => response.json())
			.then(async(resultado) => {
				DOMSeccionActual.value = resultado.seccion.letra;
				await buscarEstudiantesSeccionActual();
			})
			.catch(error => console.error(error));
		
		DOMUnidades.style.display = 'block';
		configurarUnidades(resultado.unidades);
	}



	async function iniciarInscripcion(formData) {
		const params = new URLSearchParams(formData);
		const url = `/administrador/inscripcion/${cache.cedula}`;
		const options = {
			method: 'POST',
			body: params
		}

		const respuesta = await fetch(url, options);
		const resultado = await respuesta.json();
		if(!respuesta.ok) {
			console.error(resultado);
			return lanzarError(resultado.mensaje);
		}

		mostrarNotificacion({ error: false, mensaje: resultado.mensaje });

		BtnIniciarProceso.innerText = 'Cancelar Proceso';
		BtnIniciarProceso.addEventListener('click', borrarInscripcion);

		DOMCarreraCursada.disabled = true;
		DOMTrayecto.disabled = true;
		DOMSeccionNueva.disabled = true;
		DOMSeccionActual.value = DOMSeccionNueva.value;
		DOMSeccionNueva.value = '';
		DOMCantidadNueva.innerText = '0';

		DOMUnidades.style.display = 'block';

		buscarUnidadesInscritas(cache.cedula);
		buscarEstudiantesSeccionActual();
	}


	async function buscarUnidadesInscritas(cedula) {
		const url = `/estudiante/inscripcion/unidades?cedula=${cedula}`;

		const respuesta = await fetch(url);
		const data = await respuesta.json();

		if(!respuesta.ok) {
			console.log(data);
			return lanzarError({ error: true, mensaje: data.mensaje });
		}

		configurarUnidades(data.unidades);
	}



	async function configurarUnidades(unidades) {
		const inscritas = unidades.filter(u => u.situacion_uc === 'I');
		const noInscritas = unidades.filter(u => u.situacion_uc === 'N');
		const reprobadas = unidades.filter(u => u.situacion_uc === 'R');

		const DOMReprobadas = document.getElementById('uc-reprobadas-tabla');
		const DOMNoInscritas = document.getElementById('uc-porInscribir-tabla');
		const DOMInscritas = document.getElementById('uc-inscritas-tabla');

		const ids = ["nav-reprobadas-tab", "nav-porInscribir-tab", "nav-inscritas-tab"];

		document.getElementById(ids[0]).innerText = `Reprobadas: ${reprobadas.length}`;
		document.getElementById(ids[1]).innerText = `Por Inscribir: ${noInscritas.length}`;
		document.getElementById(ids[2]).innerText = `Inscritas: ${inscritas.length}`;

		removerAnidados(DOMReprobadas);
		removerAnidados(DOMNoInscritas);
		removerAnidados(DOMInscritas);

		const crear = (codigo, nombre, estado) => elt('tr', {},
			elt('td', {}, 
				elt('input', { type: "checkbox", className: `form-check-input ${estado}`, value: "" })
			),
			elt('td', { scope: 'col' }, codigo),
			elt('td', { scope: 'col' }, nombre)
		);

		inscritas.forEach(x => DOMInscritas.appendChild(crear(x.codigo_uc, x.nombre_uc, 'inscrita')));
		noInscritas.forEach(x => DOMNoInscritas.appendChild(crear(x.codigo_uc, x.nombre_uc, 'noInscrita')));
		reprobadas.forEach(x => DOMReprobadas.appendChild(crear(x.codigo_uc, x.nombre_uc, 'reprobada')));
	}


	async function buscarEstudiantesSeccionActual() {
		const letra = InputSeccionActual.value;
		if(letra === '')
			return;

		let cantidad = await buscarCantidadEstudiantesEnSeccion(letra);
		DOMCantidadActual.innerText = `${cantidad}`;
	}


	async function buscarEstudiantesSeccionNueva() {
		const letra = InputSeccionNueva.value;
		if(letra === '')
			return;

		let cantidad =  await buscarCantidadEstudiantesEnSeccion(letra);
		DOMCantidadNueva.innerText = `${cantidad}`;
	}


	async function buscarCantidadEstudiantesEnSeccion(letra) {
		const $sede = document.getElementById('codigoSede');

		const codigoSede = $sede.value;
		const codigo = DOMCarreraCursada.value.split(' ')[0];
		const trayecto = DOMTrayecto.value;

		const url = `/administrador/seccion/inscritos?codigo=${codigo}&letra=${letra}&trayecto=${trayecto}&codigoSede=${codigoSede}`;
		const resultado = await fetch(url).then(res => res.json());

		return resultado.inscritos !== undefined ? resultado.inscritos : 0;
	}



	async function buscarEstudiante() {
		const url = `/administrador/estudiante?cedula=${cache.cedula}`;
		const response = await fetch(url);

		if(response.status === 404) {
			lanzarError('Esta cédula de identidad no corresponde a ningún estudiante');
			DOMInfo.style.display = 'none';
			DOMUnidades.style.display = 'none';
			return;
		}

		const datos = await response.json();

		if(datos.error) {
			lanzarError(datos.mensaje);
			return;
		}

		let {
			nombres,
			apellidos,
			codigoSede,
			nombreSede
		} = datos.estudiante;

		let DOMNombres = document.getElementById('nombres-apellidos');

		DOMNombres.innerText = `${apellidos} ${nombres}`;

		const $sede = document.getElementById('codigoSede');
		removerAnidados($sede);
		const $option = elt('option', { selected: '', value: codigoSede }, `${codigoSede} ${nombreSede}`)
		$sede.appendChild($option);

		buscarInscripcion();
	}


	const inscribirUnidad = async(selector, inscribiendo = true) => {
		const unidades = Array.from(document.getElementsByClassName(selector))
			.filter(element => element.checked)
			.map(s => s.parentNode.parentNode.childNodes[1].innerHTML);
		
		const url = `/administrador/inscripcion/${cache.cedula}/unidades`;
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				inscribiendo,
				unidades
			})
		}

		await fetch(url, options)
			.then(response => response.json())
			.then(async(data) => {
				if(data.error)
					throw data.mensaje;
				

				buscarInscripcion();
			})
			.catch(error => lanzarError(error));
	}


	document.getElementById('porInscribir-a-inscritas').addEventListener('click', async(event) => {
		event.preventDefault();

		inscribirUnidad('noInscrita');
	});

	document.getElementById('remover-de-inscritas').addEventListener('click', async(event) => {
		event.preventDefault();

		inscribirUnidad('inscrita', false);
	});
})();