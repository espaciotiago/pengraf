<?php
/**
 * Created by PhpStorm.
 * User: espaciotiago
 * Date: 2019-03-11
 * Time: 07:08
 */
$dbhost='localhost';
$dbport='3306';
$dbname='u807977067_dbpen';
$dbuser='u807977067_monja';
$dbpass='7p5eBx9Jn8S0vni';


$post = file_get_contents('php://input');
$obj = json_decode($post,true);
$blocks = $obj["blocks"];
$response = [];

foreach ($blocks as $block) {
    $fechaCreacion = $block["fechaCreacion"];
    $nombre = $block["nombre"];
    $descripcion = $block["descripcion"];
    $rutaImage = $block["rutaImage"];
    $nombreCreador = $block["nombreCreador"];
    $fechaUpdate = "";
    $FK_ID_EMPRESA = $block["FK_ID_EMPRESA"];

    // Create connection
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
    $insert = [];
    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());

        $response["body"] = [];
        $response["error"] = true;
        $response["message"] = "Error de conexión en la base de datos";
    }

    // Attempt insert query execution
    $sql = "INSERT INTO defaultBloque (fechaCreacion, activo, nombre, descripcion, rutaImage, nombreCreador, fechaUpdate, FK_ID_EMPRESA) VALUES ('$fechaCreacion', '1', '$nombre', '$descripcion', '$rutaImage', '$nombreCreador', '$fechaUpdate', '$FK_ID_EMPRESA')";
    if(mysqli_query($conn, $sql)){
        $insert["message"] = "Records added successfully.";
        $insert["error"] = false;
    } else{
        $insert["message"] = "ERROR: Could not able to execute $sql. " . mysqli_error($conn);
        $insert["error"] = true;
    }

    // Close connection
    mysqli_close($conn);
    $response["body"] = $insert;
}

$response["error"] = false;
$response["message"] = "Ok";

echo json_encode($response);


