(function(){
	const d = document;
	const $cedula = d.getElementById('cedula');
	const cache = {
		cedula: ''
	}


	const buscarCarrera = async() => {
		const url = `/administrador/carreras?cedula=${cache.cedula}`;
		const resultado = await fetch(url).then(response => response.json());

		if(resultado.error) {
			throw resultado.mensaje;
		}

		const activo = resultado.cursadas.filter(data => data.activo);
		if(activo.length < 1) {
			throw 'El estudiante no está activo en ninguna carrera';
		}

		return activo[0];
	}


	d.getElementById('form-buscar').onsubmit = async(formEvent) => {
		formEvent.preventDefault();

		if($cedula.value === cache.cedula) {
			return;
		}

		cache.cedula = $cedula.value;

		const formData = new FormData(formEvent.target);
		const	params = new URLSearchParams(formData);
		const url = `/administrador/estudiante?${params.toString()}`;

		const $carta = d.getElementById('datos');

		fetch(url)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.mensaje;

				return data.estudiante;
			})
			.then(async(estudiante) => {
				const carrera = await buscarCarrera();

				let formatearTrayecto = trayecto => trayecto === '0' ? 'Inicial' :
					trayecto === '1' ? 'Primero' :
					trayecto === '2' ? 'Segundo' :
					trayecto === '3' ? 'Tercero' :
					trayecto === '4' ? 'Cuarto' : 'Quinto';

				d.getElementById('apellidos-nombres').textContent = `${estudiante.apellidos} ${estudiante.nombres}`;
				d.getElementById('cedula-estudiante').textContent = estudiante.cedula;
				d.getElementById('carrera').textContent = carrera.nombre;
				d.getElementById('trayecto').textContent = formatearTrayecto(carrera.trayecto);

				$carta.style.display = 'block';
			})
			.catch(error => {
				mostrarNotificacion({ error: true, mensaje: error });
				$carta.style.display = 'none';
			});
	}


	d.getElementById('emitir').onclick = async(event) => {
		const $cargando = d.getElementById('modal-cargando');
		const modalCargando = new bootstrap.Modal($cargando, {});

		const $aviso = d.getElementById('modal-aviso');
		const modalAviso = new bootstrap.Modal($aviso, {});

		const url = `/administrador/constanciaEstudio?cedula=${cache.cedula}`;
		const blobToSaveAs = (filename, blob) => {
			try {
				const url = window.URL.createObjectURL(blob);
				const link = elt("a", { href: url, download: filename });
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
			catch(ex) {
				mostrarNotificacion({ error: true, mensaje: ex });
			}
			finally {
				modalCargando.hide();
				modalAviso.show();
			}
		}

		modalCargando.show();
		fetch(url)
			.then(response => response.blob())
			.then(readableStream => {
				const blob = new Blob([readableStream], { type: 'application/pdf' });
				blobToSaveAs(`constancia-estudio-${cache.cedula}.pdf`, blob);
			})
			.catch(error => mostrarNotificacion({ error: true, mensaje: error }))
			.finally(() => modalCargando.hide());
	}
})();