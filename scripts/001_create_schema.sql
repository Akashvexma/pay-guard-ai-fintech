-- PayGuard AI Database Schema
-- Creates tables for merchants, transactions, rules, and alerts

-- Merchants table (extends auth.users)
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT DEFAULT 'ecommerce',
  risk_tolerance INTEGER DEFAULT 50 CHECK (risk_tolerance >= 0 AND risk_tolerance <= 100),
  api_key TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  stripe_account_id TEXT,
  webhook_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  external_id TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  card_bin TEXT,
  card_last_four TEXT,
  card_brand TEXT,
  customer_email TEXT,
  customer_ip TEXT,
  customer_country TEXT,
  device_fingerprint TEXT,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  decision TEXT CHECK (decision IN ('approve', 'review', 'decline')),
  risk_factors JSONB DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'review', 'verified')),
  stripe_payment_intent_id TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES merchants(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rules table for custom merchant rules
CREATE TABLE IF NOT EXISTS rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('velocity', 'amount', 'geo', 'card', 'email', 'custom')),
  condition JSONB NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'review', 'decline', 'add_score')),
  score_modifier INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('high_risk', 'velocity', 'chargeback', 'pattern', 'system')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Whitelist/Blacklist entries
CREATE TABLE IF NOT EXISTS lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  list_type TEXT NOT NULL CHECK (list_type IN ('whitelist', 'blacklist')),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('email', 'ip', 'card_bin', 'country', 'device')),
  value TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(merchant_id, list_type, entry_type, value)
);

-- Analytics aggregates (daily summaries)
CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_transactions INTEGER DEFAULT 0,
  approved_count INTEGER DEFAULT 0,
  declined_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  total_amount_cents BIGINT DEFAULT 0,
  fraud_prevented_cents BIGINT DEFAULT 0,
  avg_risk_score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(merchant_id, date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_risk ON transactions(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_merchant ON alerts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(merchant_id, is_read) WHERE NOT is_read;
CREATE INDEX IF NOT EXISTS idx_rules_merchant ON rules(merchant_id);
CREATE INDEX IF NOT EXISTS idx_lists_merchant ON lists(merchant_id);
CREATE INDEX IF NOT EXISTS idx_daily_stats_merchant ON daily_stats(merchant_id, date DESC);

-- Enable Row Level Security
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for merchants
CREATE POLICY "merchants_select_own" ON merchants FOR SELECT USING (auth.uid() = id);
CREATE POLICY "merchants_insert_own" ON merchants FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "merchants_update_own" ON merchants FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "merchants_delete_own" ON merchants FOR DELETE USING (auth.uid() = id);

-- RLS Policies for transactions
CREATE POLICY "transactions_select_own" ON transactions FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "transactions_insert_own" ON transactions FOR INSERT WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "transactions_update_own" ON transactions FOR UPDATE USING (auth.uid() = merchant_id);
CREATE POLICY "transactions_delete_own" ON transactions FOR DELETE USING (auth.uid() = merchant_id);

-- RLS Policies for rules
CREATE POLICY "rules_select_own" ON rules FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "rules_insert_own" ON rules FOR INSERT WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "rules_update_own" ON rules FOR UPDATE USING (auth.uid() = merchant_id);
CREATE POLICY "rules_delete_own" ON rules FOR DELETE USING (auth.uid() = merchant_id);

-- RLS Policies for alerts
CREATE POLICY "alerts_select_own" ON alerts FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "alerts_insert_own" ON alerts FOR INSERT WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "alerts_update_own" ON alerts FOR UPDATE USING (auth.uid() = merchant_id);
CREATE POLICY "alerts_delete_own" ON alerts FOR DELETE USING (auth.uid() = merchant_id);

-- RLS Policies for lists
CREATE POLICY "lists_select_own" ON lists FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "lists_insert_own" ON lists FOR INSERT WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "lists_update_own" ON lists FOR UPDATE USING (auth.uid() = merchant_id);
CREATE POLICY "lists_delete_own" ON lists FOR DELETE USING (auth.uid() = merchant_id);

-- RLS Policies for daily_stats
CREATE POLICY "daily_stats_select_own" ON daily_stats FOR SELECT USING (auth.uid() = merchant_id);
CREATE POLICY "daily_stats_insert_own" ON daily_stats FOR INSERT WITH CHECK (auth.uid() = merchant_id);
CREATE POLICY "daily_stats_update_own" ON daily_stats FOR UPDATE USING (auth.uid() = merchant_id);

-- Trigger to create merchant profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_merchant()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.merchants (id, business_name, business_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'business_name', 'My Business'),
    COALESCE(NEW.raw_user_meta_data ->> 'business_type', 'ecommerce')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_merchant();
