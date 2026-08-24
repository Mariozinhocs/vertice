-- SQL Schema para Hostinger MySQL / MariaDB - SGO Vértice Campo
-- Compatível com phpMyAdmin e MySQL 5.7+ / 8.0+

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `perfil` ENUM('admin', 'coordenador', 'auditor') NOT NULL DEFAULT 'coordenador',
  `telefone` VARCHAR(30) NULL,
  `avatar_url` TEXT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `campanhas` (
  `id` VARCHAR(36) PRIMARY KEY,
  `nome` VARCHAR(200) NOT NULL,
  `descricao` TEXT NULL,
  `candidato` VARCHAR(150) NOT NULL,
  `cidade_uf` VARCHAR(100) NOT NULL,
  `data_inicio` DATE NOT NULL,
  `data_fim` DATE NOT NULL,
  `status` ENUM('ativa', 'concluida', 'planejamento') DEFAULT 'ativa',
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `regioes` (
  `id` VARCHAR(36) PRIMARY KEY,
  `campanha_id` VARCHAR(36) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` TEXT NULL,
  `cor_hex` VARCHAR(7) DEFAULT '#6366f1',
  FOREIGN KEY (`campanha_id`) REFERENCES `campanhas`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `pontos_atuacao` (
  `id` VARCHAR(36) PRIMARY KEY,
  `campanha_id` VARCHAR(36) NOT NULL,
  `regiao_id` VARCHAR(36) NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `descricao` TEXT NULL,
  `endereco` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 8) NOT NULL,
  `longitude` DECIMAL(11, 8) NOT NULL,
  `raio_tolerancia_metros` INT NOT NULL DEFAULT 50,
  `status` ENUM('ativo', 'inativo') DEFAULT 'ativo',
  FOREIGN KEY (`campanha_id`) REFERENCES `campanhas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`regiao_id`) REFERENCES `regioes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `equipes` (
  `id` VARCHAR(36) PRIMARY KEY,
  `campanha_id` VARCHAR(36) NOT NULL,
  `regiao_id` VARCHAR(36) NOT NULL,
  `coordenador_id` VARCHAR(36) NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `status` ENUM('ativa', 'inativa') DEFAULT 'ativa',
  FOREIGN KEY (`campanha_id`) REFERENCES `campanhas`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`coordenador_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `checkins` (
  `id` VARCHAR(36) PRIMARY KEY,
  `equipe_id` VARCHAR(36) NOT NULL,
  `ponto_id` VARCHAR(36) NOT NULL,
  `coordenador_id` VARCHAR(36) NOT NULL,
  `latitude` DECIMAL(10, 8) NOT NULL,
  `longitude` DECIMAL(11, 8) NOT NULL,
  `precisao_gps_m` DECIMAL(8, 2) NOT NULL,
  `distancia_calculada_m` INT NOT NULL,
  `quantidade_integrantes` INT NOT NULL DEFAULT 1,
  `imagem_url` TEXT NULL,
  `imagem_watermark_url` TEXT NULL,
  `observacoes` TEXT NULL,
  `status` ENUM('validado', 'pendente_analise', 'rejeitado', 'pendente_sync') NOT NULL,
  `status_motivo` VARCHAR(255) NULL,
  `criado_em` DATETIME NOT NULL,
  `sincronizado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`equipe_id`) REFERENCES `equipes`(`id`),
  FOREIGN KEY (`ponto_id`) REFERENCES `pontos_atuacao`(`id`),
  FOREIGN KEY (`coordenador_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `auditoria_logs` (
  `id` VARCHAR(36) PRIMARY KEY,
  `usuario_id` VARCHAR(36) NOT NULL,
  `acao` VARCHAR(100) NOT NULL,
  `entidade` VARCHAR(100) NOT NULL,
  `entidade_id` VARCHAR(36) NOT NULL,
  `detalhes` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `criado_em` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
