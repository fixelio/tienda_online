<?php

session_start();

if (isset($_SESSION['username']) == false) {
  header("Location: login.php?error=si&mensaje=Primero inicia sesión");
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprar <?php echo $_GET['marca']; ?></title>
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

  <div class="contenedor">
    <form action="comprar_producto.php" method="POST" class="row g-3">
      <div class="col-6">
        <label for="marca" class="form-label">Equipo</label>
        <input type="text" id="marca" name="marca" class="form-control" value="<?php echo $_GET["marca"]; ?>" readonly>
      </div>
      <div class="col-6">
        <label for="precio" class="form-label">Precio</label>
        <input type="number" id="precio" name="precio" class="form-control" value="<?php echo $_GET["precio"]; ?>" readonly>
      </div>
      <div class="col-6">
        <label for="id_computadora" class="form-label">Id del artículo</label>
        <input type="number" id="id_computadora" name="id_computadora" class="form-control" value="<?php echo $_GET["id_computadora"]; ?>" readonly>
      </div>
      <div class="col-6">
        <label for="id_usuario" class="form-label">Id del Usuario</label>
        <input type="text" id="id_usuario" name="id_usuario" class="form-control" value="<?php echo $_SESSION['id']; ?>" readonly>
      </div>
      <div class="col-6">
        <label class="form-label" for="cantidad">Cantidad: <span id="cantidad-rango">1</span></label>
        <input type="range" min="1" max="20" step="1" value="1" id="cantidad" name="cantidad" class="form-range">
      </div>
      <div>
        <button type="submit" class="btn btn-primary">Enviar</button>
      </div>
    </form>
  </div>
  <script src="/tienda_online/js/bootstrap.bundle.min.js"></script>
  <script>
    const cantidadRango = document.getElementById('cantidad-rango')
    const cantidadInput = document.getElementById('cantidad')

    cantidadInput.addEventListener('change', function(e){
      cantidadRango.textContent = e.target.value
    })
  </script>
</body>
</html>