-- Tabla para categorías
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tabla para productos
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

-- Políticas RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

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