<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/init_db.php';

autoInitDatabase();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT id, regiao_id as regionId, campanha_id as campaignId, nome as name, descricao as description,
                     endereco as address, latitude, longitude, raio_tolerancia_metros as radiusMeters,
                     data_agendada as scheduledDate, horario_inicio as startTime, horario_fim as endTime,
                     equipe_atribuida_id as assignedTeamId, equipe_atribuida_nome as assignedTeamName, status
              FROM pontos_atuacao ORDER BY id DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $pontos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Formata números
    foreach ($pontos as &$p) {
        $p['latitude'] = (float)$p['latitude'];
        $p['longitude'] = (float)$p['longitude'];
        $p['radiusMeters'] = (int)$p['radiusMeters'];
    }

    echo json_encode($pontos);
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
    $name = $data['name'];
    $description = $data['description'] ?? '';
    $address = $data['address'] ?? '';
    $latitude = $data['latitude'];
    $longitude = $data['longitude'];
    $radiusMeters = $data['radiusMeters'] ?? 50;
    $scheduledDate = $data['scheduledDate'] ?? null;
    $startTime = $data['startTime'] ?? null;
    $endTime = $data['endTime'] ?? null;
    $assignedTeamId = $data['assignedTeamId'] ?? null;
    $assignedTeamName = $data['assignedTeamName'] ?? null;
    $status = $data['status'] ?? 'ativo';

    $query = "INSERT INTO pontos_atuacao (id, campanha_id, regiao_id, nome, descricao, endereco, latitude, longitude, raio_tolerancia_metros, data_agendada, horario_inicio, horario_fim, equipe_atribuida_id, equipe_atribuida_nome, status)
              VALUES (:id, :campaignId, :regionId, :name, :description, :address, :latitude, :longitude, :radiusMeters, :scheduledDate, :startTime, :endTime, :assignedTeamId, :assignedTeamName, :status)
              ON DUPLICATE KEY UPDATE
                regiao_id = VALUES(regiao_id), nome = VALUES(nome), descricao = VALUES(descricao),
                endereco = VALUES(endereco), latitude = VALUES(latitude), longitude = VALUES(longitude),
                raio_tolerancia_metros = VALUES(raio_tolerancia_metros), data_agendada = VALUES(data_agendada),
                horario_inicio = VALUES(horario_inicio), horario_fim = VALUES(horario_fim),
                equipe_atribuida_id = VALUES(equipe_atribuida_id), equipe_atribuida_nome = VALUES(equipe_atribuida_nome), status = VALUES(status)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':campaignId', $campaignId);
    $stmt->bindParam(':regionId', $regionId);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':latitude', $latitude);
    $stmt->bindParam(':longitude', $longitude);
    $stmt->bindParam(':radiusMeters', $radiusMeters);
    $stmt->bindParam(':scheduledDate', $scheduledDate);
    $stmt->bindParam(':startTime', $startTime);
    $stmt->bindParam(':endTime', $endTime);
    $stmt->bindParam(':assignedTeamId', $assignedTeamId);
    $stmt->bindParam(':assignedTeamName', $assignedTeamName);
    $stmt->bindParam(':status', $status);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao salvar ponto"]);
    }
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("DELETE FROM pontos_atuacao WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(["status" => "deleted"]);
    }
    exit();
}
