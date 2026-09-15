<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro ao conectar ao banco de dados."]);
    exit();
}

try {
    // Trunca as tabelas operacionais para reiniciar o fluxo do zero
    $db->exec("TRUNCATE TABLE `checkins`");
    $db->exec("TRUNCATE TABLE `pontos_atuacao`");
    $db->exec("TRUNCATE TABLE `equipes`");
    
    echo json_encode([
        "status" => "success", 
        "message" => "Banco de dados zerado com sucesso. Pronto para a validação do zero."
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erro ao zerar banco: " . $e->getMessage()]);
}
