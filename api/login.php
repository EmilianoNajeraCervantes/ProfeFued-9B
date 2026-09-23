<?php
// PUNTO DE EXPOSICIÓN:
// 1. Principio de Responsabilidad Única: Este archivo SÓLO maneja autenticación.
// 2. Cabeceras CORS y método OPTIONS para permitir peticiones desde Ionic (localhost:8100 a localhost:80).
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Manejo del preflight (OPTIONS) para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Leer los datos (Soporta tanto JSON crudo de Axios/ThunderClient como Form-Data)
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    // Si json_decode falla o está vacío, intentamos leer de $_POST estándar
    $data = $_POST;
}

// Datos de conexión
$host = "localhost";
$user = "root";
$password = "";
$dbname = "app_ionic";

// Respuesta por defecto
$response = ["success" => false, "message" => "Ocurrió un error"];

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $pass = $data['password'];

    // Conexión
    $conn = new mysqli($host, $user, $password, $dbname);

    if ($conn->connect_error) {
        $response = ["success" => false, "message" => "Error de conexión a la BD"];
        echo json_encode($response);
        exit();
    }

    $stmt = $conn->prepare("SELECT id, nombre, apellidos FROM usuarios WHERE email = ? AND password = ?");
    $stmt->bind_param("ss", $email, $pass);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Login exitoso
        $usuario = $result->fetch_assoc();
        $response = [
            "success" => true,
            "message" => "Login exitoso",
            "usuario" => $usuario
        ];
    } else {
        $response = ["success" => false, "message" => "Credenciales incorrectas"];
    }

    $stmt->close();
    $conn->close();
} else {
    $response = ["success" => false, "message" => "Faltan datos (email o password)"];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
