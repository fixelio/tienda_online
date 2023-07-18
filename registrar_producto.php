<?php

session_start();

if (isset($_SESSION['username']) == false) {
  header("Location: inicio.php?error=si&mensaje=Antes de entrar, debes iniciar sesión.");
}

if ($_SESSION['rol'] != 'admin') {
  header("Location: index.php?error=si&mensaje=No tienes los permisos para ver esa página.");
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
            <li class="nav-item">
              <a class="nav-link" href="index.php">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="registrar_producto.php">Registrar</a>
            </li>
          </ul>
          <div class="dropdown dropstart">
            <img class="dropdown-toggle" src="https://thumbs.dreamstime.com/b/hacker-avatar-character-isolated-icon-illustration-design-84237258.jpg" width="48" height="48" style="border-radius: 50%" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Perfil</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!--


    Small sm (500px)
    Medium md (750px)
    Large lg (1300px)


    -->

    <h1>Tienda Online</h1>

    <div class="contenedor">
      <form class="row g-3" method="POST" action="registrar.php">
        <div class="col-4">
          <label for="nombre" class="form-label">Marca</label>
          <input type="text" class="form-control" id="marca" name="marca" aria-describedby="emailHelp">
        </div>
        <div class="col-4">
          <label for="nombre" class="form-label">Modelo</label>
          <input type="text" class="form-control" id="modelo" name="modelo" aria-describedby="emailHelp">
        </div>
        <div class="col-4">
          <label for="precio" class="form-label">Precio del producto</label>
          <input type="number" class="form-control" id="precio" name="precio">
        </div>
        <div class="col-12">
          <label for="url" class="form-label">Enlace a la imagen</label>
          <input type="text" class="form-control" id="url" name="url">
        </div>
        <div class="col-12">
          <label for="descripcion" class="form-label">Descripción del producto</label>
          <textarea name="descripcion" id="descripcion" class="form-control" cols="30" rows="10"></textarea>
        </div>
        <!--<div class="col-12">
          <label for="image" class="form-label">Imagen del producto</label>
          <input type="file" class="form-control" id="image" name="image" aria-describedby="image" aria-label="Upload">
        </div>-->
        <div>
          <button type="submit" class="btn btn-primary">Registrar</button>
        </div>
      </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
  </body>
</html>