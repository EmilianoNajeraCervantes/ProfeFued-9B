<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");

// Manejo del preflight (OPTIONS) para CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$password = "";
$dbname = "app_ionic";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión"]);
    exit();
}

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// PUNTO DE EXPOSICIÓN:
// 1. Arquitectura RESTful: Usamos un Switch para leer el método HTTP.
// 2. Separamos la lógica de gestión (Crear, Editar, Listar) de la lógica de Login.
switch ($method) {
    case 'GET':
        // Ejemplo: Obtener todos los usuarios
        $sql = "SELECT id, email, nombre, apellidos, telefono FROM usuarios";
        $result = $conn->query($sql);
        $usuarios = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $usuarios[] = $row;
            }
        }
        echo json_encode(["success" => true, "data" => $usuarios]);
        break;

    case 'POST':
        // Registrar un nuevo usuario
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        if (!$data) parse_str($input, $data);

        if (isset($data['email']) && isset($data['password'])) {
            $email = $data['email'];
            $pass = $data['password'];
            // Opcionales
            $nombre = isset($data['nombre']) ? $data['nombre'] : '';
            $apellidos = isset($data['apellidos']) ? $data['apellidos'] : '';
            $telefono = isset($data['telefono']) ? $data['telefono'] : '';

            // Verificar si el email ya existe
            $check = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
            $check->bind_param("s", $email);
            $check->execute();
            $check->store_result();
            
            if ($check->num_rows > 0) {
                echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
            } else {
                $stmt = $conn->prepare("INSERT INTO usuarios (email, password, nombre, apellidos, telefono) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("sssss", $email, $pass, $nombre, $apellidos, $telefono);
                if ($stmt->execute()) {
                    echo json_encode(["success" => true, "message" => "Cuenta creada exitosamente"]);
                } else {
                    echo json_encode(["success" => false, "message" => "Error al crear la cuenta"]);
                }
                $stmt->close();
            }
            $check->close();
        } else {
            echo json_encode(["success" => false, "message" => "Email y contraseña son obligatorios"]);
        }
        break;

    case 'PATCH':
        // PUNTO DE EXPOSICIÓN:
        // Uso del método PATCH para hacer actualizaciones PARCIALES dinámicas.
        // A diferencia de PUT, aquí solo actualizamos los campos que se envían (ej: solo el teléfono), ahorrando datos.
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (!$data) {
            parse_str($input, $data);
        }

        if (isset($data['id'])) {
            $id = $data['id'];
            $updates = [];
            $types = "";
            $params = [];

            // Construir la consulta dinámicamente según lo que se envíe
            if (isset($data['nombre'])) {
                $updates[] = "nombre = ?";
                $types .= "s";
                $params[] = $data['nombre'];
            }
            if (isset($data['apellidos'])) {
                $updates[] = "apellidos = ?";
                $types .= "s";
                $params[] = $data['apellidos'];
            }
            if (isset($data['telefono'])) {
                $updates[] = "telefono = ?";
                $types .= "s";
                $params[] = $data['telefono'];
            }

            if (count($updates) > 0) {
                $sql = "UPDATE usuarios SET " . implode(", ", $updates) . " WHERE id = ?";
                $types .= "i"; // El id al final
                $params[] = $id;

                $stmt = $conn->prepare($sql);
                // Vincular los parámetros dinámicamente
                $stmt->bind_param($types, ...$params);
                
                if ($stmt->execute()) {
                    echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente"]);
                } else {
                    echo json_encode(["success" => false, "message" => "Error al actualizar"]);
                }
                $stmt->close();
            } else {
                echo json_encode(["success" => false, "message" => "No se enviaron datos para actualizar"]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "ID de usuario requerido para PATCH"]);
        }
        break;

    default:
        echo json_encode(["success" => false, "message" => "Método no soportado"]);
        break;
}

$conn->close();
?>
