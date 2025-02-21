-- Todo lo relacionado con productos
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('category', 'subcategory', 'material')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  main_image TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla para imágenes adicionales de productos
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla para materiales
CREATE TABLE IF NOT EXISTS materials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Políticas RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Políticas para productos
CREATE POLICY "Productos públicos visibles para todos"
ON products
FOR SELECT
TO public
USING (active = true);

CREATE POLICY "Solo admins pueden gestionar productos"
ON products
FOR ALL
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

-- Políticas para categorías
CREATE POLICY "Categorías visibles para todos"
ON categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Solo admins pueden gestionar categorías"
ON categories
FOR ALL
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

-- Políticas para imágenes de productos
CREATE POLICY "Imágenes visibles para todos"
ON product_images
FOR SELECT
TO public
USING (true);

CREATE POLICY "Solo admins pueden gestionar imágenes"
ON product_images
FOR ALL
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

-- Políticas para materiales
CREATE POLICY "Materiales visibles para todos"
ON materials
FOR SELECT
TO public
USING (true);

CREATE POLICY "Solo admins pueden gestionar materiales"
ON materials
FOR ALL
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

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE
  ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Actualizar las categorías existentes para establecer el tipo
UPDATE categories 
SET type = 'category' 
WHERE type IS NULL;

-- Hacer que el campo type sea NOT NULL después de la actualización
ALTER TABLE categories 
ALTER COLUMN type SET NOT NULL;

-- Añadir la columna display_order si no existe
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'categories' 
    AND column_name = 'display_order'
  ) THEN
    ALTER TABLE categories
    ADD COLUMN display_order INTEGER DEFAULT 0;
  END IF;
END $$;

-- Actualizar los registros existentes con un orden basado en el nombre
UPDATE categories
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
  FROM categories
) as subquery
WHERE categories.id = subquery.id;

-- Añadir un índice para optimizar las consultas por orden si no existe
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_categories_display_order'
  ) THEN
    CREATE INDEX idx_categories_display_order ON categories(display_order);
  END IF;
END $$; 