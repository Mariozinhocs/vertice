<?php
require_once __DIR__ . '/config/database.php';

function autoInitDatabase() {
    $database = new Database();
    $db = $database->getConnection();
    if (!$db) return;

    try {
        // Tabela de Configuração do Sistema
        $db->exec("CREATE TABLE IF NOT EXISTS `system_config` (
          `key` VARCHAR(50) PRIMARY KEY,
          `value` TEXT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Verifica se a carga inicial (seed) já foi realizada
        $stmtConfig = $db->query("SELECT `value` FROM `system_config` WHERE `key` = 'schema_initialized'");
        $isInitialized = $stmtConfig ? $stmtConfig->fetchColumn() : false;

        // Tabela Campanhas
        $db->exec("CREATE TABLE IF NOT EXISTS `campanhas` (
          `id` VARCHAR(36) PRIMARY KEY,
          `nome` VARCHAR(200) NOT NULL,
          `descricao` TEXT NULL,
          `candidato` VARCHAR(150) NOT NULL,
          `cidade_uf` VARCHAR(100) NOT NULL,
          `data_inicio` DATE NOT NULL,
          `data_fim` DATE NOT NULL,
          `status` ENUM('ativa', 'concluida', 'planejamento') DEFAULT 'ativa',
          `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        if (!$isInitialized) {
            $stmt = $db->query("SELECT COUNT(*) FROM `campanhas`");
            if ($stmt->fetchColumn() == 0) {
                $db->exec("INSERT INTO `campanhas` (`id`, `nome`, `descricao`, `candidato`, `cidade_uf`, `data_inicio`, `data_fim`, `status`) VALUES
                ('cmp-manaus-2026', 'Campanha Eleitoral 2026 - Manaus / AM', 'Mobilização Operacional em Campo para Manaus', 'Candidato Majoritário', 'Manaus / AM', '2026-01-01', '2026-10-30', 'ativa')");
            }
        }

        // Tabela Regioes (Bases)
        $db->exec("CREATE TABLE IF NOT EXISTS `regioes` (
          `id` VARCHAR(36) PRIMARY KEY,
          `campanha_id` VARCHAR(36) NOT NULL DEFAULT 'cmp-manaus-2026',
          `nome` VARCHAR(100) NOT NULL,
          `descricao` TEXT NULL,
          `cor_hex` VARCHAR(7) DEFAULT '#6366f1'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        if (!$isInitialized) {
            $stmt = $db->query("SELECT COUNT(*) FROM `regioes`");
            if ($stmt->fetchColumn() == 0) {
                $db->exec("INSERT INTO `regioes` (`id`, `campanha_id`, `nome`, `descricao`, `cor_hex`) VALUES
                ('reg-norte-1', 'cmp-manaus-2026', 'Norte 1', 'Cidade Nova, Col. Santo Antônio, Monte das Oliveiras, Novo Aleixo', '#3b82f6'),
                ('reg-norte-2', 'cmp-manaus-2026', 'Norte 2', 'Col. Terra Nova, Lago Azul, Santa Etelvina, Nova Cidade', '#06b6d4'),
                ('reg-norte-3', 'cmp-manaus-2026', 'Norte 3', 'Cidade de Deus', '#38bdf8'),
                ('reg-leste', 'cmp-manaus-2026', 'Zona Leste', 'Jorge Teixeira, Tancredo Neves, Coroado, São José, Colônia Antônio Aleixo, Dist. Industrial II, Zumbi', '#f97316'),
                ('reg-sul', 'cmp-manaus-2026', 'Zona Sul', 'Betânia, Crespo, Distrito Industrial I, Educandos, Morro da Liberdade, Cachoeirinha, Centro, Japiim, Praça 14, Petrópolis', '#ec4899'),
                ('reg-centro-sul', 'cmp-manaus-2026', 'Centro-Sul', 'Adrianópolis, Aleixo, Chapada, Flores, Parque 10 de Novembro, N. S. das Graças, Presidente Vargas', '#8b5cf6'),
                ('reg-oeste', 'cmp-manaus-2026', 'Zona Oeste', 'Compensa, Glória, Santo Agostinho, São Jorge, São Raimundo, Vila da Prata, Ponta Negra, Tarumã', '#10b981'),
                ('reg-centro-oeste', 'cmp-manaus-2026', 'Centro-Oeste', 'Alvorada, Da Paz, Dom Pedro I, Lirio do Vale, Nova Esperança, Planalto, Redenção', '#eab308'),
                ('reg-rural', 'cmp-manaus-2026', 'Zona Rural', 'BR-174, AM-010, Comunidades Ribeirinhas', '#84cc16')");
            }
        }

        // Tabela Usuarios
        $db->exec("CREATE TABLE IF NOT EXISTS `usuarios` (
          `id` VARCHAR(36) PRIMARY KEY,
          `nome` VARCHAR(150) NOT NULL,
          `nome_usuario` VARCHAR(100) NULL,
          `email` VARCHAR(150) NULL,
          `senha_hash` VARCHAR(255) NULL,
          `alterar_senha` TINYINT(1) DEFAULT 1,
          `perfil` VARCHAR(50) NOT NULL DEFAULT 'coordenador',
          `telefone` VARCHAR(30) NULL,
          `regiao_id` VARCHAR(36) NULL,
          `regiao_nome` VARCHAR(100) NULL,
          `equipe_id` VARCHAR(36) NULL,
          `equipe_nome` VARCHAR(150) NULL,
          `ativo` TINYINT(1) DEFAULT 1,
          `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        try { $db->exec("ALTER TABLE `usuarios` ADD COLUMN `nome_usuario` VARCHAR(100) NULL AFTER `nome`"); } catch(Exception $e) {}
        try { $db->exec("ALTER TABLE `usuarios` ADD COLUMN `alterar_senha` TINYINT(1) DEFAULT 1 AFTER `senha_hash`"); } catch(Exception $e) {}
        try { $db->exec("ALTER TABLE `usuarios` ADD COLUMN `equipe_id` VARCHAR(36) NULL AFTER `regiao_nome`"); } catch(Exception $e) {}
        try { $db->exec("ALTER TABLE `usuarios` ADD COLUMN `equipe_nome` VARCHAR(150) NULL AFTER `equipe_id`"); } catch(Exception $e) {}

        if (!$isInitialized) {
            $stmt = $db->query("SELECT COUNT(*) FROM `usuarios`");
            if ($stmt->fetchColumn() == 0) {
                $db->exec("INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha_hash`, `perfil`, `telefone`, `regiao_id`, `regiao_nome`, `ativo`) VALUES
                ('usr-admin-1', 'Administrador Geral', 'admin@vertice.com', 'admin123', 'admin', '(92) 99100-0001', 'ALL', 'Todas as Zonas', 1),
                ('usr-coord-1', 'Carlos Eduardo Silva', 'carlos.silva@vertice.com', 'coord123', 'coordenador', '(92) 98111-2233', 'reg-leste', 'Zona Leste', 1),
                ('usr-coord-2', 'Fernanda Souza Lima', 'fernanda.souza@vertice.com', 'coord123', 'coordenador', '(92) 98222-3344', 'reg-sul', 'Zona Sul', 1),
                ('usr-campo-1', 'Lucas Ramos (Responsável)', 'lucas.ramos@vertice.com', 'campo123', 'campo', '(92) 98333-4455', 'reg-leste', 'Zona Leste', 1)");
            }
        }

        // Tabela Pontos de Atuação
        $db->exec("CREATE TABLE IF NOT EXISTS `pontos_atuacao` (
          `id` VARCHAR(36) PRIMARY KEY,
          `campanha_id` VARCHAR(36) NOT NULL DEFAULT 'cmp-manaus-2026',
          `regiao_id` VARCHAR(36) NOT NULL,
          `nome` VARCHAR(150) NOT NULL,
          `descricao` TEXT NULL,
          `endereco` VARCHAR(255) NOT NULL,
          `latitude` DECIMAL(10, 8) NOT NULL,
          `longitude` DECIMAL(11, 8) NOT NULL,
          `raio_tolerancia_metros` INT NOT NULL DEFAULT 50,
          `data_agendada` DATE NULL,
          `horario_inicio` VARCHAR(10) NULL,
          `horario_fim` VARCHAR(10) NULL,
          `equipe_atribuida_id` VARCHAR(36) NULL,
          `equipe_atribuida_nome` VARCHAR(150) NULL,
          `status` VARCHAR(20) DEFAULT 'ativo'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Tabela Equipes
        $db->exec("CREATE TABLE IF NOT EXISTS `equipes` (
          `id` VARCHAR(36) PRIMARY KEY,
          `campanha_id` VARCHAR(36) NOT NULL DEFAULT 'cmp-manaus-2026',
          `regiao_id` VARCHAR(36) NOT NULL,
          `coordenador_id` VARCHAR(36) NOT NULL,
          `coordenador_nome` VARCHAR(150) NULL,
          `nome` VARCHAR(150) NOT NULL,
          `pontos_ids_json` TEXT NULL,
          `membros_json` TEXT NULL,
          `status` VARCHAR(20) DEFAULT 'ativa'
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Tabela Checkins
        $db->exec("CREATE TABLE IF NOT EXISTS `checkins` (
          `id` VARCHAR(36) PRIMARY KEY,
          `equipe_id` VARCHAR(36) NOT NULL,
          `equipe_nome` VARCHAR(150) NULL,
          `ponto_id` VARCHAR(36) NOT NULL,
          `ponto_nome` VARCHAR(150) NULL,
          `coordenador_id` VARCHAR(36) NOT NULL,
          `coordenador_nome` VARCHAR(150) NULL,
          `latitude` DECIMAL(10, 8) NOT NULL,
          `longitude` DECIMAL(11, 8) NOT NULL,
          `precisao_gps_m` DECIMAL(8, 2) NOT NULL,
          `distancia_calculada_m` INT NOT NULL,
          `quantidade_integrantes` INT NOT NULL DEFAULT 1,
          `imagem_url` LONGTEXT NULL,
          `imagem_watermark_url` LONGTEXT NULL,
          `observacoes` TEXT NULL,
          `status` VARCHAR(30) NOT NULL,
          `status_motivo` VARCHAR(255) NULL,
          `criado_em` DATETIME NOT NULL,
          `sincronizado` TINYINT(1) DEFAULT 1
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

        // Garante que colunas de imagem em checkins e usuarios sejam LONGTEXT/MEDIUMTEXT para não truncar base64
        try { $db->exec("ALTER TABLE `checkins` MODIFY COLUMN `imagem_url` LONGTEXT NULL"); } catch(Exception $e) {}
        try { $db->exec("ALTER TABLE `checkins` MODIFY COLUMN `imagem_watermark_url` LONGTEXT NULL"); } catch(Exception $e) {}
        try { $db->exec("ALTER TABLE `usuarios` ADD COLUMN `avatar_url` MEDIUMTEXT NULL AFTER `telefone`"); } catch(Exception $e) {}
        try { $db->exec("ALTER TABLE `usuarios` MODIFY COLUMN `avatar_url` MEDIUMTEXT NULL"); } catch(Exception $e) {}

        // Marca como inicializado se ainda não estivesse marcado
        if (!$isInitialized) {
            $db->exec("INSERT INTO `system_config` (`key`, `value`) VALUES ('schema_initialized', '1') ON DUPLICATE KEY UPDATE `value` = '1'");
        }

    } catch (Exception $e) {
        error_log("Database autoInit error: " . $e->getMessage());
    }
}
