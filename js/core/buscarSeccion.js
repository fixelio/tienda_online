(function(){
	const d = document;

	const $lista = d.getElementById('lista-estudiantes');
	const $carrera = d.getElementById('pnf');
	const $trayecto = d.getElementById('trayecto');
	const $lectivo = d.getElementById('lectivo');
	const $seccion = d.getElementById('seccion');
	const $sede = d.getElementById('codigoSede');



	d.onsubmit = async(formEvent) => {
		if(!formEvent.target.matches('#form-buscar'))
			return;

		formEvent.preventDefault();

		const formData = new FormData(formEvent.target);
		formData.set('codigo', formData.get('pnf').split(' ')[0]);
		formData.delete('pnf');

		const params = new URLSearchParams(formData);
		const url = `/administrador/seccion/estudiantes?${params.toString()}`;

		fetch(url)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.mensaje;


				return data.estudiantes.map(estudiante => ({
					nombres: `${estudiante.apellidos} ${estudiante.nombres}`,
					cedula: estudiante.cedula
				}));
			})
			.then(estudiantes => {
				$lista.style.display = 'block';

				const $cuerpo = $lista.querySelector('tbody');
				removerAnidados($cuerpo);
				estudiantes.forEach((estudiante, index) => {
					let fila = elt('tr', {},
						elt('td', {}, `${index+1}`),
						elt('td', {}, estudiante.nombres),
						elt('td', {}, estudiante.cedula)
					);

					$cuerpo.appendChild(fila);
				});
			})
			.catch(error => {
				mostrarNotificacion({ error: true, mensaje: error });
				removerAnidados($seccion);
				$lista.style.display = 'none';
			});
	}

	$lectivo.onchange = async(event) => {
		const codigoSede = $sede.value;
		if(codigoSede.trim().length === 0) return;

		const lectivo = event.target.value;

		const params = new URLSearchParams({
			codigoSede,
			lectivo,
		});

		const url = `/administrador/oferta?${params.toString()}`;

		fetch(url)
			.then(response => response.json())
			.then(data => {
				if(data.error) {
					console.log(data);
					throw data;
				}

				console.log(data);

				removerAnidados($carrera);

				$carrera.appendChild(elt('option', { selected: '' }, ''));

				return data.ofertas.map(c => elt('option', { value: c.codigo }, `${c.nombre}`));
			})
			.then(elements => elements.forEach(e => $carrera.appendChild(e)))
			.catch(error => mostrarNotificacion({ error: true, mensaje: error.mensaje }));
	}

	$carrera.onchange = async(event) => {
		const codigo = $carrera.value.split(' ')[0];
		if(codigo === '') return;

		removerAnidados($seccion);

		const url = `/administrador/pensum?codigo=${codigo}`;
		const resultado = await fetch(url).then(res => res.json());


		if(resultado.error) {
			mostrarNotificacion({ error: true, mensaje: resultado.mensaje });
			$lista.style.display = 'none';
			return;
		}

		let trayectos = ['Inicial', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto'];
		removerAnidados($trayecto);

		$trayecto.appendChild(elt('option', { selected: '' }, ''));

		const cantidadTrayectos = Number(resultado.pensum.trayectos);
		for(let i = 0; i <= cantidadTrayectos; i++) {
			let trayecto = trayectos[i];
			$trayecto.appendChild(
				elt('option', { value: trayecto.toLowerCase() }, trayecto)
			);
		}
	}


	$trayecto.onchange = async(event) => {
		const codigo = $carrera.value.split(' ')[0];
		const trayecto = $trayecto.value;
		const lectivo = $lectivo.value;
		const codigoSede = $sede.value;

		if(codigo === '' || trayecto === '' || lectivo === '') {
			removerAnidados(d.getElementById('seccion'));
			return;
		}

		const formData = new FormData();
		formData.set('codigo', codigo);
		formData.set('trayecto', trayecto);
		formData.set('lectivo', lectivo);
		formData.set('codigoSede', codigoSede);

		const params = new URLSearchParams(formData);
		const url = `/administrador/secciones?${params.toString()}`;

		fetch(url)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.mensaje;

				return data.secciones;
			})
			.then(secciones => secciones.map(seccion => elt('option', {}, seccion.letra)))
			.then(letras => {
				
				removerAnidados($seccion);

				$seccion.appendChild(elt('option', { selected: '' }, ''));
				letras.forEach(letra => $seccion.appendChild(elt('option', {}, letra)));
			})
			.catch(error => {
				mostrarNotificacion({ error: true, mensaje: error });
				$lista.style.display = 'none';
				removerAnidados($seccion);
			});

	}
})();