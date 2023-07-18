<?php

session_start();

if (isset($_SESSION['usuario']) == false) {
  echo "No has iniciado sesión.";
}
else {
  echo "Usuario: ".$_SESSION['usuario'];
}

?>