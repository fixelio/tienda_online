<?php

session_start();

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');
$comando = "SELECT * FROM computadora";

$computadoras = mysqli_query($conexion, $comando);

mysqli_close($conexion);

$error = '';
$mensaje = '';

if (isset($_GET['error'])) {
  $error = $_GET['error'];
}

if (isset($_GET['mensaje'])) {
  $mensaje = $_GET['mensaje'];
}

?>



<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tienda Online</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
    <link rel="stylesheet" href="main.css">
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
                  <li><a class="dropdown-item" href="ver_historial.php">Ver Historial</a></li>
                  <li><a class="dropdown-item" href="cerrar_sesion.php">Cerrar Sesión</a></li>
                </ul>
              </div>

              <?php

            }

          ?>

        </div>
      </div>
    </nav>

    <h1>Tienda Online</h1>

    <?php

    if ($error == "no") {

      ?>

        <div class="alert alert-success">
          <?php echo $mensaje; ?>
        </div>

    <?php

    }
    
    ?>

<?php

if ($error == "si") {

  ?>

    <div class="alert alert-danger">
      <?php echo $mensaje; ?>
    </div>

<?php

}

?>

    <div class="contenedor">
      <div class="row g-3">
        <?php
          while($fila = mysqli_fetch_assoc($computadoras)) {
            ?>
            <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2">
              <div class="card">
                <img src="<?php echo $fila['url'] ?>" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title"><?php echo $fila['marca'] ?> <?php echo $fila['modelo'] ?></h5>
                  <p>Precio: <?php echo $fila['precio'] ?>$</p>
                  <?php
                  if($_SESSION['rol'] != 'admin'){
                    ?>
                  
                  <a class="btn btn-primary" href="compra.php?marca=<?php echo 
                  $fila["marca"]; ?>&modelo=<?php echo $fila['modelo']; ?>&precio=<?php echo $fila['precio']; ?>&id_computadora=<?php echo $fila['id']; ?>">Comprar</a>
                  <?php
                  }
                  ?>
                  <?php

                  if($_SESSION['rol'] == 'admin'){

                  ?>
                    <a href="modificar_producto.php?id_computadora=<?php echo $fila ['id']; ?>&marca=<?php echo $fila ['marca']; ?>&modelo=<?php echo $fila ['modelo']; ?>&precio=<?php echo $fila ['precio']; ?>&url=<?php echo $fila ['url']; ?>&descripcion=<?php echo $fila ['descripcion']; ?>" class="btn btn-secondary">Editar</a>
                    <a href="eliminar_producto.php?id_computadora=<?php echo $fila['id']; ?>" class="btn btn-danger">Eliminar</a>
                  <?php

                  }

                  ?>
                </div>
              </div>
            </div>
            <?php
          }
        ?>
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
  </body>
</html>