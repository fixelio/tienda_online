(function() {
	const d = document;

	const $cedula = d.getElementById('cedula_doc'),
		$nombres = d.getElementById('nombres_doc'),
		$apellidos = d.getElementById('apellidos_doc');

	const $establecer = d.querySelector('button[type=submit]');

	const cache = {
		cedula: ''
	}


	d.onsubmit = async(e) => {
		if(!e.target.matches('#form-establecer'))
			return;

		e.preventDefault();

		const formData = new FormData(e.target);
		formData.set('pnf', formData.get('pnf').split(' ')[0]);

		const params = new URLSearchParams(formData),
			url = `/administrador/coordinador`,
			options = { method: 'PATCH', body: params };

		fetch(url, options)
			.then(response => response.json())
			.then(data => {
				if(data.error) throw data.mensaje;

				mostrarNotificacion({ error: false, mensaje: data.mensaje });

				let $error = d.getElementById('alerta-noExistente');
				$error.style.display = 'none';
			})
			.catch(error => mostrarNotificacion({ error: true, mensaje: error }));
	}


	d.getElementById('pnf').onchange = async(event) => {
		const codigo = event.target.value.split(' ')[0];
		const url = `/administrador/coordinador?codigo=${codigo}`;

		const resultado = await fetch(url).then(res => res.json());
		const $error = d.getElementById('alerta-noExistente');

		if(resultado.error) {
			$error.style.display = 'block';
			$error.textContent = `La carrera ${event.target.value} no tiene un coordinador registrado`;

			$cedula.value = '';
			$nombres.value = '';
			$apellidos.value = '';
		}
		else {
			const coordinador = resultado.coordinador;

			$cedula.value = coordinador.cedula_doc;
			$nombres.value = coordinador.nombres_doc;
			$apellidos.value = coordinador.apellidos_doc;

			$error.style.display = 'none';
		}
	}


	$cedula.onblur = async(e) => {
		if($cedula.value === cache.cedula) {
			return;
		}

		const formData = new FormData();
		formData.set('cedula', $cedula.value);

		const params = new URLSearchParams(formData);
		const url = `/administrador/docente?${params.toString()}`;

		const resultado = await fetch(url);

		$establecer.disabled = !resultado.ok;

		if(!resultado.ok) {
			mostrarNotificacion({ error: true, mensaje: 'No hay ningún docente registrado con esta cédula' });
			if(!$cedula.classList.contains('is-invalid')) {
				$cedula.classList.add('is-invalid');
			}
		}
		else {
			$cedula.classList.remove('is-invalid');
			cache.cedula = $cedula.value;

			const { docente } = await resultado.json();

			$nombres.value = docente.nombres_doc;
			$apellidos.value = docente.apellidos_doc;
		}
	}
})();
/*





(function() {
	const query = s => document.querySelectorAll(s);
	const show = e => {
		e.style.display = 'block';
	}

	const hide = e => {
		e.style.display = 'none';
	} 

	const getCode = code => code.split(' ')[0];

	const buscarDomCarreras = () => Array.from(query('#dom-carrera'));




	let filas;
	let carreraSeleccionada = null;

	function mostrarModal() {
		const dom = document.querySelector('#modal-cambiar');
		const modal = new bootstrap.Modal(dom, {});
		const formBuscar = document.getElementById('form-buscar');

		const btnEstablecer = document.querySelector('#establecer-coord');


		const info = {
			noExistente: document.querySelector('#info-noExistente'),
			datos: document.querySelector('#info-datos'),
			carrera: document.querySelector('#info-carrera'),
			contenedor: document.querySelector('#datos-coordinador')
		}

		formBuscar.onsubmit = async(e) => {
			e.preventDefault();

			const formData = new FormData(e.target);
			const params = new URLSearchParams(formData);


			const url = `/administrador/docente/?${params.toString()}`;
			const result = await fetch(url).then(response => response.json());

			if(result.error) {
				show(info.noExistente);
				hide(info.contenedor)
				btnEstablecer.disabled = true;
				return;
			}

			hide(info.noExistente);

			const docente = result.docente;

			show(info.contenedor);

			info.carrera.innerText = carreraSeleccionada.children[1].innerText;
			info.datos.innerText = `${docente.apellidos_doc} ${docente.nombres_doc}`;

			btnEstablecer.disabled = false;
		}

		formBuscar.reset();
		modal.show();
	}

	window.addEventListener('DOMContentLoaded', () => {


		filas = buscarDomCarreras();
		filas.forEach(x => x.addEventListener('click', e => {
			const fila = e.target.parentNode;


			fila.classList.toggle('table-secondary');


			if(fila.classList.contains('table-secondary')) {

				if(carreraSeleccionada !== null) {
					carreraSeleccionada.classList.remove('table-secondary');
				}

				carreraSeleccionada = fila;
				mostrarModal();
			}
			else {
				carreraSeleccionada = null;
			}
		}));
	});
})();
*/