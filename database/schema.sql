
-- Amigos de Patas - schema.sql
-- Projeto Integrador Extensionista II

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS amigos_de_patas;

CREATE DATABASE amigos_de_patas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE amigos_de_patas;

-- Tabela de animais
CREATE TABLE animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie ENUM('Cachorro', 'Gato', 'Outro') NOT NULL,
    raca VARCHAR(100),
    idade INT,
    sexo ENUM('Macho', 'Fêmea', 'Não informado')
        DEFAULT 'Não informado',
    descricao TEXT,
    status ENUM('Disponível', 'Reservado', 'Adotado')
        NOT NULL DEFAULT 'Disponível',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de pessoas interessadas
CREATE TABLE interessados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    cidade VARCHAR(100),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de adoções
CREATE TABLE adocoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    interessado_id INT NOT NULL,
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pendente', 'Aprovada', 'Concluída', 'Cancelada')
        NOT NULL DEFAULT 'Pendente',
    FOREIGN KEY (animal_id) REFERENCES animais(id),
    FOREIGN KEY (interessado_id) REFERENCES interessados(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de doadores
CREATE TABLE doadores (
    id_doador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    tipo_doador ENUM('Pessoa física', 'Empresa') NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefone VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de categorias
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de insumos
CREATE TABLE insumos (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT,
    nome VARCHAR(100) NOT NULL,
    unidade VARCHAR(30) NOT NULL,
    FOREIGN KEY (id_categoria)
        REFERENCES categorias(id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de doações
CREATE TABLE doacoes (
    id_doacao INT AUTO_INCREMENT PRIMARY KEY,
    id_doador INT NOT NULL,
    data_doacao DATE NOT NULL,
    observacao TEXT,
    FOREIGN KEY (id_doador)
        REFERENCES doadores(id_doador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela associativa entre doações e insumos
CREATE TABLE doacao_insumo (
    id_doacao INT NOT NULL,
    id_insumo INT NOT NULL,
    quantidade DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_doacao, id_insumo),
    FOREIGN KEY (id_doacao)
        REFERENCES doacoes(id_doacao)
        ON DELETE CASCADE,
    FOREIGN KEY (id_insumo)
        REFERENCES insumos(id_insumo),
    CHECK (quantidade > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
