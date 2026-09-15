<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/init_db.php';

autoInitDatabase();

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $query = "SELECT id, nome as name, nome_usuario as username, email, senha_hash as password, alterar_senha as mustChangePassword, perfil as role, telefone as phone, avatar_url as avatarUrl, regiao_id as regionId, regiao_nome as regionName, equipe_id as teamId, equipe_nome as teamName, ativo as active FROM usuarios ORDER BY nome ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($usuarios as &$u) {
        $u['active'] = (bool)$u['active'];
        $u['mustChangePassword'] = isset($u['mustChangePassword']) ? (bool)$u['mustChangePassword'] : false;
    }

    echo json_encode($usuarios);
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
    $name = $data['name'];
    $username = $data['username'] ?? null;
    $email = $data['email'] ?? null;
    $password = $data['password'] ?? '7070';
    $mustChangePassword = isset($data['mustChangePassword']) ? ($data['mustChangePassword'] ? 1 : 0) : 1;
    $role = $data['role'] ?? 'coordenador';
    $phone = $data['phone'] ?? null;
    $avatarUrl = $data['avatarUrl'] ?? null;
    $regionId = $data['regionId'] ?? null;
    $regionName = $data['regionName'] ?? null;
    $teamId = $data['teamId'] ?? null;
    $teamName = $data['teamName'] ?? null;
    $active = isset($data['active']) ? ($data['active'] ? 1 : 0) : 1;

    $query = "INSERT INTO usuarios (id, nome, nome_usuario, email, senha_hash, alterar_senha, perfil, telefone, avatar_url, regiao_id, regiao_nome, equipe_id, equipe_nome, ativo)
              VALUES (:id, :name, :username, :email, :password, :mustChangePassword, :role, :phone, :avatarUrl, :regionId, :regionName, :teamId, :teamName, :active)
              ON DUPLICATE KEY UPDATE
                nome = VALUES(nome), nome_usuario = VALUES(nome_usuario), email = VALUES(email),
                senha_hash = VALUES(senha_hash), alterar_senha = VALUES(alterar_senha),
                perfil = VALUES(perfil), telefone = VALUES(telefone), avatar_url = VALUES(avatar_url),
                regiao_id = VALUES(regiao_id), regiao_nome = VALUES(regiao_nome),
                equipe_id = VALUES(equipe_id), equipe_nome = VALUES(equipe_nome), ativo = VALUES(ativo)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':mustChangePassword', $mustChangePassword, PDO::PARAM_INT);
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':avatarUrl', $avatarUrl);
    $stmt->bindParam(':regionId', $regionId);
    $stmt->bindParam(':regionName', $regionName);
    $stmt->bindParam(':teamId', $teamId);
    $stmt->bindParam(':teamName', $teamName);
    $stmt->bindParam(':active', $active, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $id]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erro ao salvar usuário"]);
    }
    exit();
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if ($id) {
        $stmt = $db->prepare("DELETE FROM usuarios WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(["status" => "deleted"]);
    }
    exit();
}
