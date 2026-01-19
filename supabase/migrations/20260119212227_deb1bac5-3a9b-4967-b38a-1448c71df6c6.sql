-- Criar tabela para armazenar imagens geradas
CREATE TABLE public.puzzle_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  puzzle_id INTEGER NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permitir leitura pública (imagens são recursos compartilhados)
ALTER TABLE public.puzzle_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Imagens são públicas para leitura" 
  ON public.puzzle_images FOR SELECT 
  USING (true);

CREATE POLICY "Sistema pode inserir imagens" 
  ON public.puzzle_images FOR INSERT 
  WITH CHECK (true);

-- Criar bucket de storage para as imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('puzzle-images', 'puzzle-images', true);

-- Política para leitura pública das imagens
CREATE POLICY "Imagens de puzzle são públicas"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'puzzle-images');

-- Política para upload via edge function (service role)
CREATE POLICY "Service role pode fazer upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'puzzle-images');