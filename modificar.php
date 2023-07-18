<?php 

$conexion = mysqli_connect('localhost', 'root', '', 'tienda');
$marca = $_POST['marca'];
$modelo = $_POST['modelo'];
$precio = $_POST['precio'];
$url = htmlspecialchars($_POST['url']);
$descripcion = $_POST['descripcion'];

$computadora = $_POST ['id_computadora'];
$comando = "UPDATE computadora SET marca ='$marca', modelo = '$modelo', precio = '$precio', url = '$url', descripcion = '$descripcion' WHERE id = $computadora";

mysqli_query($conexion, $comando);

mysqli_close($conexion);

header ('Location: index.php?error=no&mensaje=Producto editado');

?>