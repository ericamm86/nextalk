CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) DEFAULT 'A fazer',
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tarefas_status_check CHECK (
        status IN ('A fazer', 'Em andamento', 'Concluido')
    )
);

CREATE TABLE IF NOT EXISTS ponto (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo VARCHAR(20) NOT NULL,
    CONSTRAINT ponto_tipo_check CHECK (
        tipo IN ('Entrada', 'Intervalo Saida', 'Intervalo Retorno', 'Saida')
    )
);
