<?php

$computadora = $_GET ['id_computadora'];

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');

$comando = "DELETE FROM computadora WHERE id = $computadora";
mysqli_query($conexion, $comando);

mysqli_close($conexion);
header ('Location: index.php?error=no&mensaje=Producto eliminado');

?>