<?php

session_start();

$id = $_SESSION['id'];

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');

$comando = "SELECT id_usuario, marca, precio, cantidad FROM compra inner join computadora on compra.id_computadora = computadora.id where id_usuario = $id";
$resultado = mysqli_query($conexion, $comando);

mysqli_close($conexion);

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Historial</title>
  <link href="http://127.0.0.1/tienda_online/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="main.css">
</head>
<body>
<nav class="navbar py-4 navbar-expand-lg bg-dark border-bottom border-bottom-dark" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand text-white" href="#">Tienda Online</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse mr-3" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

          <li class="nav-item">
            <a class="nav-link" href="index.php">Inicio</a>
          </li>

          <?php
          
          if (isset($_SESSION['username']) == false) {
          
          ?>
            
            <li class="nav-item">
              <a class="nav-link" href="login.php">Iniciar Sesión</a>
            </li>
            
          <?php

          }
          
          ?>

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

        <?php

          if (isset($_SESSION['username']) == true) {

            ?>

            <div class="dropdown dropstart">
              <img class="dropdown-toggle" src="https://thumbs.dreamstime.com/b/hacker-avatar-character-isolated-icon-illustration-design-84237258.jpg" width="48" height="48" style="border-radius: 50%" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="ver_perfil.php">Ver Perfil</a></li>
                <li><a class="dropdown-item" href="cerrar_sesion.php">Cerrar Sesión</a></li>
              </ul>
            </div>

            <?php

          }

        ?>

      </div>
    </div>
  </nav>
  <h1 class="text-center">Historial de Compras</h1>
  <div class="contenedor">
    <ul class="list-group list-group-flush">
      <?php 
      
      while($fila = mysqli_fetch_assoc($resultado)) {
        
      ?><li class="list-group-item"><?php echo $fila['marca']; ?> x<?php echo $fila["cantidad"]; ?></li><?php
      }
      
      ?>
    </ul>
  </div>
  <script src="/tienda_online/js/bootstrap.bundle.min.js"></script>
</body>
</html>