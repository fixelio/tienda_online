<?php

$marca = $_POST['marca'];
$modelo = $_POST['modelo'];
$precio = $_POST['precio'];
$url = $_POST['url'];
$descripcion = $_POST['descripcion'];

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');
$comando = "INSERT INTO computadora (marca, modelo, precio, descripcion, url) VALUES ('".$marca."', '".$modelo."', ".$precio.", '".$descripcion."', '".$url."')";

mysqli_query($conexion, $comando);

mysqli_close($conexion);

header("Location: index.php?error=no&mensaje=El Producto Se ha Registrado");

?>