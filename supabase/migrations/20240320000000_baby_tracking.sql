
-- Create babies table
CREATE TABLE babies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthDate TIMESTAMP WITH TIME ZONE NOT NULL,
  color TEXT CHECK (color IN ('blue', 'pink', 'mint', 'lavender', 'peach')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create naps table
CREATE TABLE naps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
  startTime TIMESTAMP WITH TIME ZONE NOT NULL,
  endTime TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feeds table
CREATE TABLE feeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
  amount DECIMAL(4,1) NOT NULL CHECK (amount >= 0.5),
  time TIMESTAMP WITH TIME ZONE NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID REFERENCES babies(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 10),
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE naps ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can only see their own babies"
ON babies FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Users can only access naps for their babies"
ON naps FOR ALL
USING (baby_id IN (
  SELECT id FROM babies WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access feeds for their babies"
ON feeds FOR ALL
USING (baby_id IN (
  SELECT id FROM babies WHERE user_id = auth.uid()
));

CREATE POLICY "Users can only access ratings for their babies"
ON ratings FOR ALL
USING (baby_id IN (
  SELECT id FROM babies WHERE user_id = auth.uid()
));
