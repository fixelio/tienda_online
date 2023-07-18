<?php

$username = $_POST['username'];
$telefono = $_POST['telefono'];
$facebook = $_POST['facebook'];
$instagram = $_POST['instagram'];

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');

$comando = "INSERT INTO perfil (username, telefono, facebook, instagram) VALUES ('$username', '$telefono','$facebook','$instagram')";
mysqli_query($conexion, $comando);

mysqli_close($conexion);

header("Location: crear_perfil.php");

?>