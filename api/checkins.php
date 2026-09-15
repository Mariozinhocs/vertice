<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/init_db.php';

autoInitDatabase();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Helper para salvar imagem Base64 como arquivo em api/uploads/evidencias
function saveBase64ImageToFile($base64Data, $idPrefix = 'chk') {
    if (empty($base64Data)) return null;

    // Se já for uma URL (http ou api/uploads/...), não precisa decodificar
    if (strpos($base64Data, 'data:image') === false) {
        return $base64Data;
    }

    $uploadDir = __DIR__ . '/uploads/evidencias/';
    if (!file_exists($uploadDir)) {
        @mkdir($uploadDir, 0777, true);
    }

    if (preg_match('/^data:image\/(\w+);base64,/', $base64Data, $type)) {
        $imgRaw = substr($base64Data, strpos($base64Data, ',') + 1);
        $ext = strtolower($type[1]);
        if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
            $ext = 'jpg';
        }
        $decoded = base64_decode($imgRaw);
        if ($decoded !== false) {
            $safeId = preg_replace('/[^a-zA-Z0-9_-]/', '', $idPrefix);
            $filename = 'evidencia_' . $safeId . '_' . time() . '.' . $ext;
            $filepath = $uploadDir . $filename;
            if (@file_put_contents($filepath, $decoded)) {
                return 'api/uploads/evidencias/' . $filename;
            }
        }
    }

    // Fallback: caso a escrita em disco falhe, mantém a string base64
    return $base64Data;
}

if ($method === 'GET') {
    $query = "SELECT id, equipe_id as teamId, equipe_nome as teamName, ponto_id as actionPointId, ponto_nome as pointName,
                     coordenador_id as coordinatorId, coordenador_nome as coordinatorName, latitude, longitude,
                     precisao_gps_m as gpsAccuracyMeters, distancia_calculada_m as distanceCalculatedMeters,
                     quantidade_integrantes as memberCount, imagem_url as imageUrl, imagem_watermark_url as imageWatermarkUrl,
                     observacoes as notes, status, status_motivo as statusReason, criado_em as timestamp, sincronizado as synced
              FROM checkins ORDER BY criado_em DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $checkins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($checkins as &$c) {
        $c['latitude'] = (float)$c['latitude'];
        $c['longitude'] = (float)$c['longitude'];
        $c['gpsAccuracyMeters'] = (float)$c['gpsAccuracyMeters'];
        $c['distanceCalculatedMeters'] = (int)$c['distanceCalculatedMeters'];
        $c['memberCount'] = (int)$c['memberCount'];
        $c['synced'] = (bool)$c['synced'];
    }

    echo json_encode($checkins);
    exit();
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["message" => "Dados incompletos"]);
        exit();
    }

    $id = $data['id'];
    $teamId = $data['teamId'] ?? '';
    $teamName = $data['teamName'] ?? '';
    $actionPointId = $data['actionPointId'] ?? '';
    $pointName = $data['pointName'] ?? '';
    $coordinatorId = $data['coordinatorId'] ?? '';
    $coordinatorName = $data['coordinatorName'] ?? '';
    $latitude = $data['latitude'] ?? 0;
    $longitude = $data['longitude'] ?? 0;
    $gpsAccuracyMeters = $data['gpsAccuracyMeters'] ?? 0;
    $distanceCalculatedMeters = $data['distanceCalculatedMeters'] ?? 0;
    $memberCount = $data['memberCount'] ?? 1;

    // Salva imagens no disco ou como LONGTEXT
    $rawImageWatermark = $data['imageWatermarkUrl'] ?? $data['imageUrl'] ?? null;
    $savedWatermarkUrl = saveBase64ImageToFile($rawImageWatermark, $id);
    $imageUrl = $savedWatermarkUrl;
    $imageWatermarkUrl = $savedWatermarkUrl;

    $notes = $data['notes'] ?? null;
    $status = $data['status'] ?? 'validado';
    $statusReason = $data['statusReason'] ?? null;
    $timestamp = $data['timestamp'] ?? date('Y-m-d H:i:s');
    $synced = 1;

    $query = "INSERT INTO checkins (id, equipe_id, equipe_nome, ponto_id, ponto_nome, coordenador_id, coordenador_nome, latitude, longitude, precisao_gps_m, distancia_calculada_m, quantidade_integrantes, imagem_url, imagem_watermark_url, observacoes, status, status_motivo, criado_em, sincronizado)
              VALUES (:id, :teamId, :teamName, :actionPointId, :pointName, :coordinatorId, :coordinatorName, :latitude, :longitude, :gpsAccuracyMeters, :distanceCalculatedMeters, :memberCount, :imageUrl, :imageWatermarkUrl, :notes, :status, :statusReason, :timestamp, :synced)
              ON DUPLICATE KEY UPDATE
                imagem_url = VALUES(imagem_url), imagem_watermark_url = VALUES(imagem_watermark_url),
                status = VALUES(status), status_motivo = VALUES(status_motivo), sincronizado = VALUES(sincronizado)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':teamId', $teamId);
    $stmt->bindParam(':teamName', $teamName);
    $stmt->bindParam(':actionPointId', $actionPointId);
    $stmt->bindParam(':pointName', $pointName);
    $stmt->bindParam(':coordinatorId', $coordinatorId);
    $stmt->bindParam(':coordinatorName', $coordinatorName);
    $stmt->bindParam(':latitude', $latitude);
    $stmt->bindParam(':longitude', $longitude);
    $stmt->bindParam(':gpsAccuracyMeters', $gpsAccuracyMeters);
    $stmt->bindParam(':distanceCalculatedMeters', $distanceCalculatedMeters);
    $stmt->bindParam(':memberCount', $memberCount);
    $stmt->bindParam(':imageUrl', $imageUrl);
    $stmt->bindParam(':imageWatermarkUrl', $imageWatermarkUrl);
    $stmt->bindParam(':notes', $notes);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':statusReason', $statusReason);
    $stmt->bindParam(':timestamp', $timestamp);
    $stmt->bindParam(':synced', $synced, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "id" => $id,
            "imageUrl" => $imageUrl,
            "imageWatermarkUrl" => $imageWatermarkUrl
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao salvar checkin"]);
    }
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID não fornecido"]);
        exit();
    }

    // Buscar imagens para deletar fisicamente
    $stmt = $db->prepare("SELECT imagem_url, imagem_watermark_url FROM checkins WHERE id = :id");
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        if (!empty($row['imagem_url']) && strpos($row['imagem_url'], 'api/uploads/') === 0) {
            $file = __DIR__ . '/../' . $row['imagem_url'];
            if (file_exists($file)) @unlink($file);
        }
        if (!empty($row['imagem_watermark_url']) && strpos($row['imagem_watermark_url'], 'api/uploads/') === 0) {
            $file = __DIR__ . '/../' . $row['imagem_watermark_url'];
            if (file_exists($file)) @unlink($file);
        }
    }

    $stmt = $db->prepare("DELETE FROM checkins WHERE id = :id");
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Checkin apagado com sucesso"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao apagar checkin"]);
    }
    exit();
}

