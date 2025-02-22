-- Desactivar RLS temporalmente para todas las tablas
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_relations DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_color_relations DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_material_relations DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_attributes DISABLE ROW LEVEL SECURITY;

-- Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "enable_read_for_authenticated" ON admins;
DROP POLICY IF EXISTS "enable_write_for_main_admin" ON admins;
DROP POLICY IF EXISTS "admin_delete_policy" ON admins;
DROP POLICY IF EXISTS "admin_insert_policy" ON admins;
DROP POLICY IF EXISTS "admin_select_policy" ON admins;
DROP POLICY IF EXISTS "admin_update_policy" ON admins;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON admins;
DROP POLICY IF EXISTS "Enable read for admins" ON admins;
DROP POLICY IF EXISTS "Enable write for admins" ON admins;
DROP POLICY IF EXISTS "admins puedenver er la tabla de admins" ON admins;

-- Asegurar que existe el admin principal
INSERT INTO admins (email)
VALUES ('lemonsimplify@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Habilitar RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Crear una única política simple para lectura
CREATE POLICY "enable_read_for_authenticated"
ON admins
FOR SELECT
TO authenticated
USING (true);

-- Crear una política para escritura solo para el admin principal
CREATE POLICY "enable_write_for_main_admin"
ON admins
FOR ALL
TO authenticated
USING (auth.email() = 'lemonsimplify@gmail.com')
WITH CHECK (auth.email() = 'lemonsimplify@gmail.com');