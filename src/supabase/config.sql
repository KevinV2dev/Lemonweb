-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Cualquiera puede crear citas" ON appointments;
DROP POLICY IF EXISTS "Permitir crear citas sin autenticación" ON appointments;
DROP POLICY IF EXISTS "Solo admins pueden ver todas las citas" ON appointments;
DROP POLICY IF EXISTS "Los clientes solo pueden ver sus propias citas" ON appointments;
DROP POLICY IF EXISTS "Solo super admin puede gestionar admins" ON admins;
DROP POLICY IF EXISTS "Solo admins pueden actualizar citas" ON appointments;
DROP POLICY IF EXISTS "Solo admins pueden eliminar citas" ON appointments;

-- Habilitar RLS en las tablas
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Política para permitir crear citas a cualquiera
CREATE POLICY "Permitir crear citas sin autenticación"
ON appointments
FOR INSERT
TO public
WITH CHECK (true);

-- Política para que los admins vean todas las citas
CREATE POLICY "Solo admins pueden ver todas las citas"
ON appointments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.email()
  )
);

-- Política para que los clientes vean sus propias citas
CREATE POLICY "Los clientes solo pueden ver sus propias citas"
ON appointments
FOR SELECT
TO public
USING (client_email = auth.email() OR auth.email() IS NULL);

-- Política para que solo el super admin gestione admins
CREATE POLICY "Solo super admin puede gestionar admins"
ON admins
TO authenticated
USING (auth.email() = 'vegaskevin46@gmail.com')
WITH CHECK (auth.email() = 'vegaskevin46@gmail.com');

-- Política para que los admins puedan actualizar citas
CREATE POLICY "Solo admins pueden actualizar citas"
ON appointments
FOR UPDATE
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

-- Política para que los admins puedan eliminar citas
CREATE POLICY "Solo admins pueden eliminar citas"
ON appointments
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.email()
  )
);

-- Asegurar que el admin principal existe
INSERT INTO admins (email)
VALUES ('vegaskevin46@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Modificar la tabla appointments para usar un ID secuencial simple
ALTER TABLE appointments 
DROP COLUMN IF EXISTS appointment_id;

-- Crear una secuencia para el ID
CREATE SEQUENCE IF NOT EXISTS appointment_id_seq START 1;

-- Añadir la columna appointment_id con formato de 4 dígitos
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS appointment_id TEXT 
DEFAULT LPAD(nextval('appointment_id_seq')::TEXT, 4, '0');

-- Asegurarnos que el appointment_id sea único
ALTER TABLE appointments 
ADD CONSTRAINT unique_appointment_id UNIQUE (appointment_id);

-- Eliminar cualquier constraint único en appointment_date si existe
ALTER TABLE appointments 
DROP CONSTRAINT IF EXISTS unique_appointment_date;

-- Todo lo relacionado con configuración y citas
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  -- ... resto de campos
);

CREATE TABLE IF NOT EXISTS admins (
  email TEXT PRIMARY KEY
);

-- ... resto de tablas y políticas relacionadas con configuración