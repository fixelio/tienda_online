<?php

session_start();

if (isset($_SESSION['username']) == false) {
  header("Location: inicio.php?ERROR=si&mensaje=Antes de entrar, debes iniciar sesión.");
}

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');

$username = $_SESSION['username'];

$comando = "SELECT * FROM perfil WHERE username = '$username'";
$resultado = mysqli_fetch_assoc(mysqli_query($conexion, $comando));

mysqli_close($conexion);

?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</head>
<body>
  <nav class="navbar py-4 navbar-expand-lg bg-dark border-bottom border-bottom-dark" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Tienda Online</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse mr-3" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="index.php">Inicio</a>
          </li>
          <?php
            
            if ($_SESSION['rol'] == 'admin') {

            ?>
              
              <li class="nav-item">
                <a class="nav-link" href="registrar_producto.php">Registrar</a>
              </li>
              
            <?php

            }
            
            ?>
        </ul>
        <div class="dropdown dropstart">
          <img class="dropdown-toggle" src="https://thumbs.dreamstime.com/b/hacker-avatar-character-isolated-icon-illustration-design-84237258.jpg" width="48" height="48" style="border-radius: 50%" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="ver_perfil.php">Ver Perfil</a></li>
              <li><a class="dropdown-item" href="crear_perfil.php">Crear Perfil</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <h1>Mi Perfil</h1>

  <div class="contenedor">
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><i class="bi bi-person-circle"></i> Nombre de Usuario: <?php echo $resultado['username']; ?></li>
      <li class="list-group-item"><i class="bi bi-telephone"></i> Telefono: <?php echo $resultado['telefono']; ?></li>
      <li class="list-group-item"><i class="bi bi-facebook"></i> Facebook: <?php echo $resultado['facebook']; ?></li>
      <li class="list-group-item"><i class="bi bi-instagram"></i> Instagram: <?php echo $resultado['instagram']; ?></li>
    </ul>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
</body>
</html>