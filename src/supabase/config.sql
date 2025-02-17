-- Eliminar todas las políticas y tablas existentes
DROP POLICY IF EXISTS "Cualquiera puede crear citas" ON appointments;
DROP POLICY IF EXISTS "Solo admins pueden ver todas las citas" ON appointments;
DROP POLICY IF EXISTS "Los clientes solo pueden ver sus propias citas" ON appointments;
DROP POLICY IF EXISTS "Solo super admin puede gestionar admins" ON admins;

DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS admins;

-- Crear tabla de admins
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crear tabla de appointments (sin la columna service)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  phone TEXT,
  preferred_contact_time TEXT CHECK (preferred_contact_time IN ('morning', 'afternoon', 'evening')),
  address TEXT
);

-- Insertar admin inicial
INSERT INTO admins (email)
VALUES ('vegaskevin46@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Habilitar RLS en ambas tablas
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Políticas para appointments
CREATE POLICY "Cualquiera puede crear citas"
ON appointments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Solo admins pueden ver todas las citas"
ON appointments FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.email()
  )
);

CREATE POLICY "Los clientes solo pueden ver sus propias citas"
ON appointments FOR SELECT
TO anon, authenticated
USING (client_email = auth.email());

-- Política para admins
CREATE POLICY "Solo super admin puede gestionar admins"
ON admins
TO authenticated
USING (auth.email() = 'vegaskevin46@gmail.com')
WITH CHECK (auth.email() = 'vegaskevin46@gmail.com');

-- Agregar política para permitir que los admins puedan actualizar citas
CREATE POLICY "Solo admins pueden actualizar citas"
ON appointments FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.email()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.email()
  )
);

-- Agregar política para permitir que los admins puedan eliminar citas
CREATE POLICY "Solo admins pueden eliminar citas"
ON appointments FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.email()
  )
);

-- Asegurarnos que el status solo pueda tener los valores permitidos
ALTER TABLE appointments 
  DROP CONSTRAINT IF EXISTS appointments_status_check,
  ADD CONSTRAINT appointments_status_check 
  CHECK (status IN ('pending', 'completed', 'cancelled'));

-- Verifica si hay administradores
SELECT * FROM admins;

-- Si necesitas insertar un administrador de prueba
INSERT INTO admins (email)
VALUES ('admin@ejemplo.com')
ON CONFLICT (email) DO NOTHING; 