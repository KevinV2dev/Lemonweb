-- Crear el tipo ENUM para el estado del producto
CREATE TYPE product_status AS ENUM ('published', 'draft', 'out_of_stock', 'review');

-- Añadir la nueva columna status
ALTER TABLE products 
ADD COLUMN status product_status DEFAULT 'draft';

-- Migrar los datos existentes
UPDATE products 
SET status = CASE 
  WHEN active = true THEN 'published'::product_status 
  ELSE 'draft'::product_status 
END;

-- Hacer status NOT NULL después de la migración
ALTER TABLE products 
ALTER COLUMN status SET NOT NULL;

-- Actualizar las políticas existentes
DROP POLICY IF EXISTS "Productos públicos visibles para todos" ON products;
DROP POLICY IF EXISTS "Solo admins pueden gestionar productos" ON products;

-- Nueva política para lectura pública de productos
CREATE POLICY "Productos públicos visibles para todos"
ON products
FOR SELECT
TO public
USING (status = 'published');

-- Nueva política para gestión de productos (solo admins)
CREATE POLICY "Solo admins pueden gestionar productos"
ON products
FOR ALL
TO authenticated
USING (auth.email() IN (SELECT email FROM admins))
WITH CHECK (auth.email() IN (SELECT email FROM admins));

-- Eliminar la columna active después de asegurarnos que todo está bien
-- ALTER TABLE products DROP COLUMN active; 