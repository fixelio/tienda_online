<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perfil</title>
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
          <li><a class="dropdown-item" href="ver_perfil.php">Ver Perfil</a></li>
              <li><a class="dropdown-item" href="crear_perfil.php">Crear Perfil</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <h1>Mi perfil</h1>

  <div class="contenedor">
    <form action="registrar_perfil.php" method="POST" class="row g-3">
      <div class="col-6">
        <label class="form-label" for="username">Usuario</label>
        <input type="text" id="username" name="username" class="form-control">
      </div>
      <div class="col-6">
        <label class="form-label" for="telefono">Teléfono</label>
        <input type="text" id="telefono" name="telefono" class="form-control">
      </div>
      <div class="col-6">
        <label class="form-label" for="facebook">Facebook</label>
        <input type="text" id="facebook" name="facebook" class="form-control">
      </div>
      <div class="col-6">
        <label class="form-label" for="instagram">Instagram</label>
        <input type="text" id="instagram" name="instagram" class="form-control">
      </div>
      <div>
        <button class="btn btn-primary">Guardar</button>
      </div>
    </form>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
</body>
</html>