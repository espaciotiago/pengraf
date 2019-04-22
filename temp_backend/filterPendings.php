<?php
/**
 * Created by PhpStorm.
 * User: espaciotiago
 * Date: 2019-03-22
 * Time: 17:51
 */
$dbhost='localhost';
$dbport='3306';
$dbname='u807977067_dbpen';
$dbuser='u807977067_monja';
$dbpass='7p5eBx9Jn8S0vni';

$filterCategory = $_GET['cia'];
$filterCategory = $_GET['cat'];
$filterArea= $_GET['area'];

echo $filterCategory . "\n";
echo $filterArea . "\n";

// Create connection
$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);
$response = [];

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());

    $response["body"] = [];
    $response["error"] = true;
    $response["message"] = "Error de conexión en la base de datos";
}

$sql = "SELECT * FROM Pendiente WHERE ";
$result = mysqli_query($conn, $sql);
$list = array();

if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        $list[] = $row;
    }
    $response["body"] = $list;
    $response["error"] = false;
    $response["message"] = "ok";
} else {
    $response["body"] = [];
    $response["error"] = true;
    $response["message"] = "No hay compañias existentes";
}

echo json_encode($response);