<?php

$username = $_POST['username'];
$password = $_POST['password'];
$correo = $_POST['correo'];

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');

$comandoVerificar = "SELECT * FROM usuario WHERE username = '$username'";
$resultado = mysqli_query($conexion, $comandoVerificar);

if (mysqli_num_rows($resultado) == 1) {
  header("Location: registrar_usuario.php?error=si&mensaje=Este usuario ya existe");
  exit;
}

$comando = "INSERT INTO usuario (username, password, correo) VALUES ('$username', '$password', '$correo')";
mysqli_query($conexion, $comando);

mysqli_close($conexion);

session_start();

$_SESSION['username'] = $username;
$_SESSION['correo'] = $correo;

header("Location: index.php?error=no&mensaje=Se ha creado el usuario");

?>