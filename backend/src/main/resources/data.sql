-- Limpa as tabelas de forma eficiente e respeitando as constraints
TRUNCATE TABLE material_keywords CASCADE;
TRUNCATE TABLE materials CASCADE;
TRUNCATE TABLE users CASCADE;

-- Inserts de Usuários
INSERT INTO users (id, name, email, password, photo_url, role, created_at, last_activity, refresh_token)
VALUES
    ('123e4567-e89b-12d3-a456-426614174000', 'João Silva', 'joao.silva@example.com', '$2a$10$mOlhTPP/ufma1IkeacIUD.3ZzcL5wc1gXqLcLCKSJT4I2ppcfANqq', 'url_to_photo_1', 'USER', NOW(), NOW(), ''),
    ('123e4567-e89b-12d3-a456-426614174001', 'Maria Oliveira', 'maria.oliveira@example.com', '$2a$10$mOlhTPP/ufma1IkeacIUD.3ZzcL5wc1gXqLcLCKSJT4I2ppcfANqq', 'url_to_photo_2', 'USER', NOW(), NOW(), ''),
    ('123e4567-e89b-12d3-a456-426614174002', 'Pedro Santos', 'pedro.santos@example.com', '$2a$10$mOlhTPP/ufma1IkeacIUD.3ZzcL5wc1gXqLcLCKSJT4I2ppcfANqq', 'url_to_photo_3', 'USER', NOW(), NOW(), ''),
    ('123e4567-e89b-12d3-a456-426614174003', 'Ana Pereira', 'ana.pereira@example.com', '$2a$10$mOlhTPP/ufma1IkeacIUD.3ZzcL5wc1gXqLcLCKSJT4I2ppcfANqq', 'url_to_photo_4', 'USER', NOW(), NOW(), ''),
    ('123e4567-e89b-12d3-a456-426614174004', 'Lucas Almeida', 'lucas.almeida@example.com', '$2a$10$mOlhTPP/ufma1IkeacIUD.3ZzcL5wc1gXqLcLCKSJT4I2ppcfANqq', 'url_to_photo_5', 'USER', NOW(), NOW(), '');

-- Inserts de Materiais
INSERT INTO materials (title, description, type, area, file_name, user_id, total_download, total_view, file_size, file_type, upload_date, created_at, update_at)
VALUES
-- Materiais para João Silva
('Artigo sobre IA', 'Um estudo sobre Inteligência Artificial', 'ARTICLE', 'COMPUTER_SCIENCE', 'artigo_ia.pdf', '123e4567-e89b-12d3-a456-426614174000', 0, 0, '2MB', 'PDF', NOW(), NOW(), NOW()),
('Imagem de Computação', 'Imagem sobre processamento de imagens', 'IMAGE', 'COMPUTER_SCIENCE','imagem_computacao.jpg', '123e4567-e89b-12d3-a456-426614174000', 0, 0, '1MB', 'JPG', NOW(), NOW(), NOW()),
('TCC sobre Redes Neurais', 'Trabalho de Conclusão de Curso sobre Redes Neurais', 'TCC', 'COMPUTER_SCIENCE', 'tcc_redes_neurais.pdf', '123e4567-e89b-12d3-a456-426614174000', 0, 0, '3MB', 'PDF', NOW(), NOW(), NOW()),
('Resumo de Algoritmos', 'Resumo sobre algoritmos e estruturas de dados', 'NOTES', 'COMPUTER_SCIENCE', 'resumo_algoritmos.pdf', '123e4567-e89b-12d3-a456-426614174000', 0, 0, '1.5MB', 'PDF', NOW(), NOW(), NOW()),
('Apresentação de IA', 'Apresentação sobre a aplicação da IA', 'PRESENTATION', 'COMPUTER_SCIENCE', 'apresentacao_ia.pptx', '123e4567-e89b-12d3-a456-426614174000', 0, 0, '10MB', 'PPTX', NOW(), NOW(), NOW()),

-- Materiais para Maria Oliveira
('Artigo sobre Psicologia', 'Estudo sobre psicologia comportamental', 'ARTICLE', 'PSYCHOLOGY', 'artigo_psicologia.pdf', '123e4567-e89b-12d3-a456-426614174001', 0, 0, '2MB', 'PDF', NOW(), NOW(), NOW()),
('Imagem de Psicologia', 'Imagem ilustrativa sobre psicologia', 'IMAGE', 'PSYCHOLOGY', 'imagem_psicologia.jpg', '123e4567-e89b-12d3-a456-426614174001', 0, 0, '1.5MB', 'JPG', NOW(), NOW(), NOW()),
('TCC sobre Transtornos Mentais', 'TCC sobre transtornos mentais e suas implicações', 'TCC', 'PSYCHOLOGY', 'tcc_transtornos_mentais.pdf', '123e4567-e89b-12d3-a456-426614174001', 0, 0, '3MB', 'PDF', NOW(), NOW(), NOW()),
('Resumo sobre Psicologia Cognitiva', 'Resumo sobre psicologia cognitiva e suas teorias', 'NOTES', 'PSYCHOLOGY', 'resumo_psicologia_cognitiva.pdf', '123e4567-e89b-12d3-a456-426614174001', 0, 0, '1.5MB', 'PDF', NOW(), NOW(), NOW()),
('Apresentação sobre Psicoterapia', 'Apresentação sobre técnicas de psicoterapia', 'PRESENTATION', 'PSYCHOLOGY', 'apresentacao_psicoterapia.pptx', '123e4567-e89b-12d3-a456-426614174001', 0, 0, '12MB', 'PPTX', NOW(), NOW(), NOW()),

-- Materiais para Pedro Santos
('Artigo sobre Administração', 'Estudo sobre administração empresarial', 'ARTICLE', 'BUSINESS', 'artigo_administracao.pdf', '123e4567-e89b-12d3-a456-426614174002', 0, 0, '2MB', 'PDF', NOW(), NOW(), NOW()),
('Imagem de Negócios', 'Imagem sobre ambiente corporativo', 'IMAGE', 'BUSINESS', 'imagem_negocios.jpg', '123e4567-e89b-12d3-a456-426614174002', 0, 0, '1MB', 'JPG', NOW(), NOW(), NOW()),
('TCC sobre Marketing Digital', 'TCC sobre estratégias de marketing digital', 'TCC', 'BUSINESS', 'tcc_marketing_digital.pdf', '123e4567-e89b-12d3-a456-426614174002', 0, 0, '3.5MB', 'PDF', NOW(), NOW(), NOW()),
('Resumo sobre Gestão de Projetos', 'Resumo sobre gestão de projetos empresariais', 'NOTES', 'BUSINESS', 'resumo_gerenciamento_projetos.pdf', '123e4567-e89b-12d3-a456-426614174002', 0, 0, '1.2MB', 'PDF', NOW(), NOW(), NOW()),
('Apresentação sobre Finanças Corporativas', 'Apresentação sobre estratégias de finanças corporativas', 'PRESENTATION', 'BUSINESS', 'apresentacao_financas.pptx', '123e4567-e89b-12d3-a456-426614174002', 0, 0, '10MB', 'PPTX', NOW(), NOW(), NOW()),

-- Materiais para Ana Pereira
('Artigo sobre Direito', 'Estudo sobre jurisprudência e direito constitucional', 'ARTICLE', 'LAW', 'artigo_direito.pdf', '123e4567-e89b-12d3-a456-426614174003', 0, 0, '2.3MB', 'PDF', NOW(), NOW(), NOW()),
('Imagem de Justiça', 'Imagem sobre temas jurídicos', 'IMAGE', 'LAW', 'imagem_justica.jpg', '123e4567-e89b-12d3-a456-426614174003', 0, 0, '1.4MB', 'JPG', NOW(), NOW(), NOW()),
('TCC sobre Direito Penal', 'TCC sobre implicações do direito penal', 'TCC', 'LAW', 'tcc_direito_penal.pdf', '123e4567-e89b-12d3-a456-426614174003', 0, 0, '4MB', 'PDF', NOW(), NOW(), NOW()),
('Resumo sobre Direito Civil', 'Resumo sobre direito civil e suas ramificações', 'NOTES', 'LAW', 'resumo_direito_civil.pdf', '123e4567-e89b-12d3-a456-426614174003', 0, 0, '1.7MB', 'PDF', NOW(), NOW(), NOW()),
('Apresentação sobre Processos Judiciais', 'Apresentação sobre processos judiciais e seus procedimentos', 'PRESENTATION', 'LAW', 'apresentacao_processos.pptx', '123e4567-e89b-12d3-a456-426614174003', 0, 0, '15MB', 'PPTX', NOW(), NOW(), NOW());
