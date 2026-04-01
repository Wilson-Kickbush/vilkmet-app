-- ============================================================
-- VILKMET — Supabase Row Level Security (RLS) Policies
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- IMPORTANTE: Prisma usa la conexión directa (service_role), que bypasea RLS.
-- Estas policies aplican a conexiones via Supabase JS client o API REST.
-- Para la API de Next.js con Prisma + DATABASE_URL, RLS no aplica directamente.
-- Activar esto si se usa @supabase/supabase-js en el frontend.

-- ============================================================
-- Tabla: Lead
-- ============================================================
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;

-- Anónimos solo pueden insertar (captura de leads del cotizador)
CREATE POLICY "anon_insert_leads"
  ON "Lead"
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Solo usuarios autenticados (admin) pueden leer
CREATE POLICY "auth_select_leads"
  ON "Lead"
  FOR SELECT
  TO authenticated
  USING (true);

-- Solo admin puede actualizar leads
CREATE POLICY "auth_update_leads"
  ON "Lead"
  FOR UPDATE
  TO authenticated
  USING (true);

-- Solo admin puede eliminar leads
CREATE POLICY "auth_delete_leads"
  ON "Lead"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Tabla: Quote
-- ============================================================
ALTER TABLE "Quote" ENABLE ROW LEVEL SECURITY;

-- Anónimos pueden insertar cotizaciones (vinculadas a su propio lead)
CREATE POLICY "anon_insert_quotes"
  ON "Quote"
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Solo admin puede leer, actualizar y eliminar cotizaciones
CREATE POLICY "auth_select_quotes"
  ON "Quote"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "auth_update_quotes"
  ON "Quote"
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "auth_delete_quotes"
  ON "Quote"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Tabla: QuoteItem
-- ============================================================
ALTER TABLE "QuoteItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_quote_items"
  ON "QuoteItem"
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "auth_all_quote_items"
  ON "QuoteItem"
  FOR ALL
  TO authenticated
  USING (true);

-- ============================================================
-- Tabla: SystemParameter (solo admin)
-- ============================================================
ALTER TABLE "SystemParameter" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_system_params"
  ON "SystemParameter"
  FOR ALL
  TO authenticated
  USING (true);

-- ============================================================
-- Tabla: Transaction (solo admin — contabilidad interna)
-- ============================================================
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_all_transactions"
  ON "Transaction"
  FOR ALL
  TO authenticated
  USING (true);

-- ============================================================
-- Nota de Seguridad Adicional:
-- Activar también "Leaked password protection" en Auth Settings
-- y configurar CAPTCHA en el formulario si se implementa Supabase Auth.
-- ============================================================
