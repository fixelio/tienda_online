<?php

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');

$username = $_POST['username'];
$password = $_POST['password'];

$filas = mysqli_query($conexion, "SELECT * FROM usuario WHERE username = '$username'");
// $filas es información acerca de filas de la tabla



if (mysqli_num_rows($filas) == 0) {
  header("Location: login.php?error=si&mensaje=Este usuario no existe");
}
else {
  $usuario = mysqli_fetch_assoc($filas); // $usuario es la información

  if ($usuario['password'] != $password) {
    header("Location: login.php?error=si&mensaje=La contraseña es incorrecta.");
  }
  else {
    session_start();

    $_SESSION['id'] = $usuario['id'];
    $_SESSION['username'] = $usuario['username'];
    $_SESSION['correo'] = $usuario['correo'];
    $_SESSION['rol'] = $usuario['rol'];

    header("Location: index.php");
  }
}

mysqli_close($conexion);

?>