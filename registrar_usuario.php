<?php

$error = '';
$mensaje = '';

if (isset($_GET['error'])) {
  $error = $_GET['error'];
}

if (isset($_GET['mensaje'])) {
  $mensaje = $_GET['mensaje'];
}

?>


<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrate</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  <link rel="stylesheet" href="main.css">
</head>
<body>
  <div class="contenedor">
    <div class="card w-50 mx-auto">
      <div class="card-body">
        <h1 class="text-center mb-4">Crea tu cuenta</h1>
        <div>
          <p>Los campos obligatorios están marcados con (*)</p>
          <?php 
          if ($error == "si") {
            ?>
              <div class="alert alert-danger">
                <?php echo $mensaje; ?>
              </div>
            <?php
          }
          ?>
          <form action="registrarelusuario.php" method="POST">
            <div class="row g-3">
              <div class="col-12">
                <label for="username" class="form-label">Usuario</label>
                <input type="text" id="username" name="username" class="form-control">
              </div>
              <div class="col-12">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" id="password" name="password" class="form-control">
              </div>
              <div class="col-12">
                <label for="correo" class="form-label">Correo</label>
                <input type="email" id="correo" name="correo" class="form-control">
              </div>
              <div>
                <button type="submit" class="btn btn-primary">Registrar</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</body>
</html>