/*(function(){

	let unidadSeleccionada = null;

	const unidadOnClick = async($unidad) => {
		$unidad.classList.toggle('table-secondary');
		if($unidad.classList.contains('table-secondary')) {

			if(unidadSeleccionada !== null)
				unidadSeleccionada.classList.remove('table-secondary');

			unidadSeleccionada = $unidad;


			buscarEstudiantes($unidad);
		}
		else {
			unidadSeleccionada = null;
		}
	}

	async function buscarEstudiantes($dom) {
		const codigo = $dom.children[5].textContent;
		const trayecto = $dom.children[3].textContent.toLowerCase();

		const params = new URLSearchParams({ codigo, trayecto });
		const url = `/administrador/secciones?${params.toString()}`;

		fetch(url)
			.then(response => response.json())
			.then(data => console.log(data))
			.catch(error => mostrarNotificacion({ error: true, mensaje: error }));
	}

	window.addEventListener('DOMContentLoaded', () => {
		const unidades = document.getElementsByClassName('unidad');

		for(const $unidad of unidades) {
			$unidad.onclick = async(e) => unidadOnClick(e.target.parentNode);
		}
	});
})();
*/