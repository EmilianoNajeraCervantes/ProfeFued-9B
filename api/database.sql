-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS app_ionic;
USE app_ionic;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    apellidos VARCHAR(100),
    telefono VARCHAR(20),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Primera carga (Objeto / Datos iniciales)
INSERT INTO usuarios (email, password, nombre, apellidos, telefono)
VALUES 
('admin@app.com', '123456', 'Administrador', 'Sistema', '5551234567'),
('usuario@app.com', 'password', 'Usuario', 'Demo', '5559876543');
