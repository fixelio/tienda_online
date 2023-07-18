const mensaje = document.getElementById('alertMessage');
const alertas = document.getElementById('alertas');

if(mensaje !== undefined || mensaje !== null) {
	setTimeout(() => mensaje.remove(), 6000);
}

function alerta(error, texto) {
	if(alertas.firstChild) {
		alertas.removeChild(alertas.firstChild);
	}

	alertas.appendChild(
		elt("div",
			{
				className: `alert alert-${error ? "danger" : "success"} fixed-bottom`,
				role: "alert",
				id: "alertMessage"
			},
			`${error ? 'Error' : 'Información'}: ${texto}`
		)
	);

	setTimeout(() => alertas.removeChild(alertas.firstChild), 3000);
}

async function mostrarNotificacion(datos) {
	const nivel = datos.error ? 'error' : 'exito';
	const dom = document.getElementById(`notificacion-${nivel}`);
	const domMensaje = document.getElementById(`toast-mensaje-${nivel}`);
	
	const toast = new bootstrap.Toast(dom);
	domMensaje.innerText = datos.mensaje;

	toast.show();
}