-- Primero desactivamos RLS
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Limpiamos políticas existentes
DROP POLICY IF EXISTS "allow_read_to_authenticated" ON admins;
DROP POLICY IF EXISTS "allow_all_to_main_admin" ON admins;

-- Nos aseguramos que la tabla existe
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT auth.uid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Limpiamos la tabla
TRUNCATE TABLE admins;

-- Insertamos el admin principal
INSERT INTO admins (email)
VALUES ('lemonsimplify@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Mantenemos RLS desactivado para evitar la recursión
-- La seguridad la manejaremos a nivel de aplicación verificando el email 