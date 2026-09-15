<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/init_db.php';

autoInitDatabase();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT id, campanha_id as campaignId, regiao_id as regionId, coordenador_id as coordinatorId,
                     coordenador_nome as coordinatorName, nome as name, pontos_ids_json, membros_json, status
              FROM equipes ORDER BY id DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $equipes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($equipes as &$eq) {
        $eq['assignedPointIds'] = json_decode($eq['pontos_ids_json'] ?? '[]', true) ?: [];
        $eq['members'] = json_decode($eq['membros_json'] ?? '[]', true) ?: [];
        unset($eq['pontos_ids_json'], $eq['membros_json']);
    }

    echo json_encode($equipes);
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
    $regionId = $data['regionId'] ?? 'reg-norte-1';
    $coordinatorId = $data['coordinatorId'] ?? 'usr-admin-1';
    $coordinatorName = $data['coordinatorName'] ?? 'Coordenador Geral';
    $name = $data['name'];
    $assignedPointIds = json_encode($data['assignedPointIds'] ?? []);
    $members = json_encode($data['members'] ?? []);
    $status = $data['status'] ?? 'ativa';

    $query = "INSERT INTO equipes (id, campanha_id, regiao_id, coordenador_id, coordenador_nome, nome, pontos_ids_json, membros_json, status)
              VALUES (:id, :campaignId, :regionId, :coordinatorId, :coordinatorName, :name, :assignedPointIds, :members, :status)
              ON DUPLICATE KEY UPDATE
                regiao_id = VALUES(regiao_id), coordenador_id = VALUES(coordenador_id), coordenador_nome = VALUES(coordenador_nome),
                nome = VALUES(nome), pontos_ids_json = VALUES(pontos_ids_json), membros_json = VALUES(membros_json), status = VALUES(status)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':campaignId', $campaignId);
    $stmt->bindParam(':regionId', $regionId);
    $stmt->bindParam(':coordinatorId', $coordinatorId);
    $stmt->bindParam(':coordinatorName', $coordinatorName);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':assignedPointIds', $assignedPointIds);
    $stmt->bindParam(':members', $members);
    $stmt->bindParam(':status', $status);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao salvar equipe"]);
    }
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("DELETE FROM equipes WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(["status" => "deleted"]);
    }
    exit();
}
