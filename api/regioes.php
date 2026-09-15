<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/init_db.php';

autoInitDatabase();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT id, campanha_id as campaignId, nome as name, descricao as description, cor_hex as color FROM regioes ORDER BY nome ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $regioes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($regioes);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) || !isset($data['name'])) {
        http_response_code(400);
        echo json_encode(["message" => "Dados incompletos"]);
        exit();
    }

    $id = $data['id'];
    $campaignId = $data['campaignId'] ?? 'cmp-manaus-2026';
    $name = $data['name'];
    $description = $data['description'] ?? '';
    $color = $data['color'] ?? '#6366f1';

    $query = "INSERT INTO regioes (id, campanha_id, nome, descricao, cor_hex)
              VALUES (:id, :campaignId, :name, :description, :color)
              ON DUPLICATE KEY UPDATE nome = VALUES(nome), descricao = VALUES(descricao), cor_hex = VALUES(cor_hex)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':campaignId', $campaignId);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':color', $color);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao salvar região"]);
    }
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("DELETE FROM regioes WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(["status" => "deleted"]);
    }
    exit();
}
