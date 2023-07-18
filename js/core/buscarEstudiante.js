(function(){
	const d = document;


	const query = selector => d.querySelector(selector);
	let cedula = '';


	d.onsubmit = async(formEvent) => {
		if(!formEvent.target.matches('#form-buscar')) {
			return false;
		}

		formEvent.preventDefault();

		const formData = new FormData(formEvent.target);
		const params = new URLSearchParams(formData);
		const urlEstudiante = `/administrador/estudiante?${params.toString()}`;
		const urlCarrera = `/administrador/carreras?${params.toString()}`;

		cedula = params;

		let hayErrores = false;

		const formatoFecha = strFecha => {
			let fecha = new Date(strFecha);

			let date = `${fecha.getDate()}`;
			let month = `${fecha.getMonth()+1}`;
			let year = fecha.getFullYear();

			return `${date.length == 1 ? '0'+date : date}/${month.length == 1 ? '0'+month : month}/${year}`;
		}

		await fetch(urlEstudiante)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.mensaje;

				return data.estudiante;
			})
			.then(estudiante => {
				query('#apellidos-nombres').textContent = `${estudiante.apellidos} ${estudiante.nombres}`;
				query('#cedula').textContent = estudiante.cedula;

				const $genero = d.getElementById('genero');
				$genero.classList.remove('bi-gender-male');
				$genero.classList.remove('bi-gender-female');
				$genero.classList.add(`bi-gender-${estudiante.genero === 'm' ? 'male' : 'female'}`);

				query('#lugar-nacimiento').textContent = estudiante.lugar_nacimiento;
				query('#fecha-nacimiento').textContent = formatoFecha(estudiante.fecha_nacimiento);
				query('#nacionalidad').textContent = estudiante.nacionalidad;

				let edoCiv = estudiante.estado_civil;
				query('#edo_civil').textContent = edoCiv == 's' ? 'SOLTERO' :
					edoCiv == 'c' ? 'CASADO' :
					edoCiv == 'v' ? 'VIUDO' :
					edoCiv == 'd' ? 'DIVORCIADO' : '';

				query('#institucion').textContent = estudiante.institucion;

				let tipoInstitucion = estudiante.tipo_institucion;
				query('#tipo-institucion').textContent = tipoInstitucion === 'publica' ? 'Pública':'Privada';
				query('#titulo').textContent = estudiante.titulo_obtenido;
				query('#fecha-grado').textContent = formatoFecha(estudiante.fecha_grado);

				query('#codigo_sni').textContent = estudiante.codigo_sni;
				query('#anno_sni').textContent = estudiante.anno_sni;

				let annoIngreso = new Date(estudiante.fecha_ingreso).getFullYear();
				query('#ingreso').textContent = annoIngreso;

				query('#ciudad').textContent = estudiante.municipio;
				query('#estado').textContent = estudiante.estado;
				query('#direccion').textContent = estudiante.direccion;

				query('#telPrincipal').textContent = estudiante.tel_ppal;
				//query('#telSecundario').textContent = estudiante.tel_sec;
				query('#correo').textContent = estudiante.correo;
				
				query('#datos').style.display = '';


				query('#editar-estudiante').href = `/modificar/estudiante?cedula=${estudiante.cedula}`
			})
			.catch(error => {
				hayErrores = true;
				mostrarNotificacion({ error: true, mensaje: error });
				query('#datos').style.display = 'none';
			});


		if(hayErrores) return;


		await fetch(urlCarrera)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.mensaje;

				return data.cursadas.filter(c => c.activo);
			})
			.then(cursada => {
				if(cursada.length < 1)
					throw 'El estudiante no está activo en ninguna carrera';

				return cursada[0];
			})
			.then(async(cursada) => {
				let inscripcionDom = query('#inscripcion-activa');
				inscripcionDom.textContent = '';

				query('#nombre-carrera').textContent = cursada.nombre;
				query('#anno_activo').textContent = cursada.ingreso;

				const inscripcion = await fetch(`/administrador/inscripcion?${params.toString()}`).then(res => res.json());
				if(inscripcion.error) {
					return;
				}

				if(inscripcion.cursada.codigo !== cursada.codigo) {
					return;
				}


				inscripcionDom.textContent = 'El estudiante tiene una inscripción activa';
			})
			.catch(error => mostrarNotificacion({ error: true, mensaje: error.mensaje || error }));

		await fetch(`/administrador/datos/estudiante?${params.toString()}`)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.error;

				query('#sc_aprobado').textContent = data.datos.sc_aprobado ? 'Si' : 'No';
				query('#aprobar_sc').style.display = data.datos.sc_aprobado === 1 ? 'none':'';
				query('#validar-datos').style.display = data.datos.validado === 1 ? 'none':'';
			})
			.catch(error => mostrarNotificacion({ error: true, mensaje: error.mensaje }));
	}


	d.querySelector('#validar-datos').onclick = async(event) => {
		const cedula = query('#cedula').textContent;
		const params = new URLSearchParams({ cedula, validado: 1 });
		const url = `/administrador/validar/estudiante`;
		const options = {
			method: 'PATCH',
			body: params,
		}

		const response = await fetch(url, options);
		if(!response.ok) {
			mostrarNotificacion({ error: true, mensaje: 'No se pueden validar los datos de este estudiante.' });
			return;
		}

		const data = await response.json();
		if(data.error) {
			mostrarNotificacion({ error: true, mensaje: error });
			return;
		}

		mostrarNotificacion({
			error: false,
			mensaje: data.mensaje
		});
	}


	d.querySelector('#aprobar_sc').onclick = async(e) => {
		const url = `/administrador/estudiante/servicioComunitario`;
		const options = {
			method: 'POST',
			body: cedula
		}

		const response = await fetch(url, options).json();
		if(response.error) {
			mostrarNotificacion({ error: true, mensaje: response.error });
			return;
		}

		mostrarNotificacion({
			error: false,
			mensaje: response.mensaje
		});

		e.target.style.display = 'none';
	}
})();