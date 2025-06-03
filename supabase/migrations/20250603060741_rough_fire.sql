/*
  # Initial Database Schema for UGLIES Platform
  
  1. New Tables
    - users (Authentication + Profiles)
    - categories (Product Organization)
    - products (Agricultural Products)
    - group_buys (Group Buying Engine)
    - group_participants (Many-to-Many)
    - messages (Group Communication)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public access
    - Add policies for role-based access
  
  3. Functions & Triggers
    - Auto-update timestamps
    - Generate invite codes
    - Update group quantities
    
  4. Indexes
    - Optimize common queries
    - Support real-time features
    - Enable efficient filtering
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'customer', 'coordinator', 'admin')) DEFAULT 'customer',
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  phone_confirmed_at TIMESTAMP WITH TIME ZONE,
  location JSONB,
  preferences JSONB DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  farmer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  images TEXT[] DEFAULT '{}',
  quality_grade TEXT CHECK (quality_grade IN ('premium', 'standard', 'cosmetic')) DEFAULT 'standard',
  harvest_date DATE,
  expiry_date DATE,
  organic_certified BOOLEAN DEFAULT FALSE,
  location JSONB,
  availability_status TEXT CHECK (availability_status IN ('available', 'out_of_stock', 'seasonal', 'discontinued')) DEFAULT 'available',
  tags TEXT[] DEFAULT '{}',
  nutritional_info JSONB DEFAULT '{}',
  farming_methods TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group buys table
CREATE TABLE IF NOT EXISTS public.group_buys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_quantity INTEGER NOT NULL CHECK (target_quantity > 0),
  current_quantity INTEGER NOT NULL DEFAULT 0 CHECK (current_quantity >= 0),
  min_quantity INTEGER NOT NULL DEFAULT 1 CHECK (min_quantity > 0),
  max_participants INTEGER,
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  total_cost DECIMAL(10,2) GENERATED ALWAYS AS (current_quantity * unit_price) STORED,
  invite_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('forming', 'active', 'completed', 'cancelled', 'expired')) DEFAULT 'forming',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_method TEXT CHECK (delivery_method IN ('pickup', 'delivery', 'shipping')) DEFAULT 'pickup',
  delivery_location JSONB,
  delivery_date TIMESTAMP WITH TIME ZONE,
  delivery_notes TEXT,
  payment_status TEXT CHECK (payment_status IN ('pending', 'partial', 'completed', 'refunded')) DEFAULT 'pending',
  payment_deadline TIMESTAMP WITH TIME ZONE,
  requirements JSONB DEFAULT '{}',
  rules TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group participants table
CREATE TABLE IF NOT EXISTS public.group_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.group_buys(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  notes TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(group_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.group_buys(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'system', 'announcement', 'update')) DEFAULT 'text',
  metadata JSONB DEFAULT '{}',
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_buys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users policies
CREATE POLICY "Users can view all public profiles"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true);

-- Products policies
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Farmers can manage own products"
  ON public.products FOR ALL
  USING (
    auth.uid() = farmer_id AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'farmer'
    )
  );

-- Group buys policies
CREATE POLICY "Anyone can view public group buys"
  ON public.group_buys FOR SELECT
  USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create and manage own group buys"
  ON public.group_buys FOR ALL
  USING (auth.uid() = creator_id);

-- Group participants policies
CREATE POLICY "Users can manage own participation"
  ON public.group_participants FOR ALL
  USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Group participants can view messages"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.group_participants 
      WHERE group_id = messages.group_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.group_buys 
      WHERE id = messages.group_id AND creator_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_products_farmer ON public.products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_group_buys_product ON public.group_buys(product_id);
CREATE INDEX IF NOT EXISTS idx_group_buys_creator ON public.group_buys(creator_id);
CREATE INDEX IF NOT EXISTS idx_group_buys_status ON public.group_buys(status);
CREATE INDEX IF NOT EXISTS idx_participants_group ON public.group_participants(group_id);
CREATE INDEX IF NOT EXISTS idx_participants_user ON public.group_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_group ON public.messages(group_id);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_buys_updated_at
  BEFORE UPDATE ON public.group_buys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();