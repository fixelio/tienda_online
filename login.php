<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
  <link rel="stylesheet" href="main.css">
</head>
<body>
  <div class="contenedor">
    <div class="card w-50 mx-auto">
      <div class="card-body">
        <form action="iniciar_sesion.php" method="POST" class="row g-3">
          <div class="col-12">
            <label for="username" class="form-label">Usuario</label>
            <input class="form-control" type="text" id="username" name="username">
          </div>
          <div class="col-12">
            <label for="password" class="form-label">Contraseña</label>
            <input class="form-control" type="password" id="password" name="password">
          </div>
          <div>
            <button class="btn btn-primary">Iniciar Sesión</button>
          </div>
        </form>
        <p>No tienes una cuenta? <a href="registrar_usuario.php">Crea una aquí</a></p>
      </div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
</body>
</html>