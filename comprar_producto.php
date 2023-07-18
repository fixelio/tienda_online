<?php

$id_usuario = $_POST['id_usuario'];
$id_computadora = $_POST['id_computadora'];
$cantidad = $_POST['cantidad'];

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');

$comando = "INSERT INTO compra (id_usuario, id_computadora, cantidad) VALUES ($id_usuario, $id_computadora, $cantidad)";
mysqli_query($conexion, $comando);

mysqli_close($conexion);

header("Location: index.php?error=no&mensaje=Artículo comprado");

?>