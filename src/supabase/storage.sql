-- Crear el bucket si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir lectura pública
CREATE POLICY "Imágenes públicamente accesibles"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Política para permitir que los administradores suban archivos
CREATE POLICY "Solo admins pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.email = auth.email()
  )
);

-- Política para permitir que los administradores actualicen archivos
CREATE POLICY "Solo admins pueden actualizar imágenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.email = auth.email()
  )
)
WITH CHECK (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.email = auth.email()
  )
);

-- Política para permitir que los administradores eliminen archivos
CREATE POLICY "Solo admins pueden eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE admins.email = auth.email()
  )
); 