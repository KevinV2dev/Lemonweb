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

-- Nueva tabla para relaciones múltiples entre productos y categorías
CREATE TABLE IF NOT EXISTS product_category_relations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(product_id, category_id)
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

-- Eliminar políticas existentes antes de crearlas nuevamente
DROP POLICY IF EXISTS "Productos públicos visibles para todos" ON products;
DROP POLICY IF EXISTS "Solo admins pueden gestionar productos" ON products;
DROP POLICY IF EXISTS "Relaciones de categorías visibles para todos" ON product_category_relations;
DROP POLICY IF EXISTS "Solo admins pueden gestionar relaciones de categorías" ON product_category_relations;

-- Políticas RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_relations ENABLE ROW LEVEL SECURITY;

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
);

-- Políticas para product_category_relations
CREATE POLICY "Relaciones de categorías visibles para todos"
ON product_category_relations
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM products
    WHERE products.id = product_category_relations.product_id
    AND products.active = true
  )
);

CREATE POLICY "Solo admins pueden gestionar relaciones de categorías"
ON product_category_relations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins
    WHERE admins.email = auth.email()
  )
);

-- Migración de datos existentes
DO $$ 
BEGIN
  -- Migrar las relaciones existentes de category_id a la nueva tabla
  INSERT INTO product_category_relations (product_id, category_id)
  SELECT id, category_id
  FROM products
  WHERE category_id IS NOT NULL
  ON CONFLICT DO NOTHING;
END $$;

-- Actualizar los registros existentes con un orden basado en el nombre
UPDATE categories
SET display_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
  FROM categories
) as subquery
WHERE categories.id = subquery.id;

-- Añadir índices para optimizar las consultas
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_categories_display_order'
  ) THEN
    CREATE INDEX idx_categories_display_order ON categories(display_order);
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM pg_indexes 
    WHERE indexname = 'idx_product_category_relations'
  ) THEN
    CREATE INDEX idx_product_category_relations ON product_category_relations(product_id, category_id);
  END IF;
END $$;

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE
  ON products
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Añadir la columna type si no existe
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'categories' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE categories
    ADD COLUMN type TEXT;
  END IF;
END $$;

-- Actualizar las categorías existentes para establecer el tipo
UPDATE categories 
SET type = 'category' 
WHERE type IS NULL;

-- Hacer que el campo type sea NOT NULL y añadir el CHECK constraint
ALTER TABLE categories 
ALTER COLUMN type SET NOT NULL,
ADD CONSTRAINT categories_type_check 
CHECK (type IN ('category', 'subcategory', 'material'));

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