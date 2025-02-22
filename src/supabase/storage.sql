-- Crear el bucket si no existe
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para storage.objects
DROP POLICY IF EXISTS "Imágenes públicamente accesibles" ON storage.objects;
DROP POLICY IF EXISTS "Solo admins pueden subir imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Solo admins pueden actualizar imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Solo admins pueden eliminar imágenes" ON storage.objects;

-- Política para lectura pública
CREATE POLICY "Imágenes públicamente accesibles"
ON storage.objects
FOR SELECT
TO public
USING (true);

-- Política para subir imágenes (solo admins)
CREATE POLICY "Solo admins pueden subir imágenes"
ON storage.objects
FOR INSERT
TO authenticated
USING (auth.email() IN (SELECT email FROM admins))
WITH CHECK (auth.email() IN (SELECT email FROM admins));

-- Política para actualizar imágenes (solo admins)
CREATE POLICY "Solo admins pueden actualizar imágenes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (auth.email() IN (SELECT email FROM admins))
WITH CHECK (auth.email() IN (SELECT email FROM admins));

-- Política para eliminar imágenes (solo admins)
CREATE POLICY "Solo admins pueden eliminar imágenes"
ON storage.objects
FOR DELETE
TO authenticated
USING (auth.email() IN (SELECT email FROM admins)); 