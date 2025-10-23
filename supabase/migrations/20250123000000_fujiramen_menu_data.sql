/*
  # FujiRamen Menu Data Migration
  
  Adds FujiRamen menu items and categories to the database.
  - Creates categories for the menu structure
  - Inserts all menu items with proper categorization
  - IDs are auto-generated
*/

-- Insert Categories
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('ramen', 'Ramen', '🍜', 1, true),
  ('donburi', 'Don Buri Rice Bowl', '🍚', 2, true),
  ('curry', 'Curry Rice', '🍛', 3, true),
  ('omelette', 'Omelette', '🥚', 4, true),
  ('bento', 'Bento', '🍱', 5, true),
  ('agenomo', 'Agenomo', '🍤', 6, true),
  ('sushi', 'Sushi / Maki / Sashimi', '🍣', 7, true),
  ('platter', 'Platter', '🍽️', 8, true),
  ('set-meal', 'Set Meal', '👨‍👩‍👧‍👦', 9, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Insert Ramen Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('FujiRamen Signature', 'Our signature ramen crafted with our 18-hour slow-simmered Tonkotsu broth and handmade specialty noodles. The ultimate expression of authentic ramen artistry.', 350, 'ramen', true, true),
  ('Shoyu Premium', 'Premium soy sauce-based ramen with a refined umami flavor, topped with traditional garnishes.', 299, 'ramen', true, true),
  ('Shoyu Regular', 'Classic soy sauce ramen with rich, savory broth and fresh toppings.', 260, 'ramen', false, true),
  ('Spicy Miso', 'Bold miso ramen with a spicy kick, balanced with rich depth and heat.', 299, 'ramen', true, true),
  ('Tonkotsu Kuro', 'Black garlic oil tonkotsu ramen with deep, smoky flavors and creamy pork bone broth.', 260, 'ramen', false, true),
  ('Tonkotsu Aka (Red)', 'Fiery red tonkotsu ramen with spicy oil, delivering intense heat and rich pork flavor.', 260, 'ramen', false, true);

-- Insert Don Buri Rice Bowl Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Katsudon', 'Crispy breaded pork cutlet simmered with egg and onions over steamed rice.', 260, 'donburi', false, true),
  ('Oyakodon', 'Classic chicken and egg rice bowl, meaning "parent and child" - a comforting Japanese staple.', 260, 'donburi', true, true),
  ('Tendon', 'Crispy tempura served over rice with savory-sweet tare sauce.', 240, 'donburi', false, true),
  ('Gyudon', 'Tender beef simmered in sweet soy sauce with onions over steamed rice.', 235, 'donburi', true, true),
  ('Tuna Don', 'Premium fresh tuna sashimi over seasoned sushi rice.', 599, 'donburi', true, true),
  ('Unagi Don', 'Grilled freshwater eel glazed with sweet tare sauce over rice.', 649, 'donburi', true, true);

-- Insert Curry Rice Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Ebi Fry Curry', 'Japanese curry with crispy breaded shrimp, vegetables, and perfectly spiced sauce.', 265, 'curry', false, true),
  ('Katsu Curry (Chicken/Pork)', 'Japanese curry with your choice of breaded chicken or pork cutlet.', 250, 'curry', true, true);

-- Insert Omelette Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Omu Katsu Curry', 'Fluffy omelette over katsu curry - a delicious fusion of textures and flavors.', 270, 'omelette', true, true),
  ('Omurice', 'Japanese omelette filled with fried rice, topped with ketchup or demi-glace.', 250, 'omelette', true, true),
  ('Tenshinhan', 'Chinese-style fluffy crab omelette over rice with savory an sauce.', 250, 'omelette', false, true);

-- Insert Bento Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Chicken Teriyaki Bento', 'Complete meal box with glazed chicken teriyaki, rice, and sides.', 260, 'bento', true, true),
  ('Pork Tonkatsu Bento', 'Complete meal box with crispy pork cutlet, rice, and traditional sides.', 260, 'bento', true, true),
  ('Ebi Tempura Bento', 'Complete meal box with shrimp tempura, rice, and assorted sides.', 280, 'bento', false, true),
  ('Chicken Tonkotsu Bento', 'Complete meal box with tender chicken in rich tonkotsu sauce, rice, and sides.', 260, 'bento', false, true);

-- Insert Agenomo (Fried Dishes / Appetizers) Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Shrimp Tempura', 'Lightly battered and fried shrimp with crispy texture.', 265, 'agenomo', false, true),
  ('Chicken Karaage', 'Japanese-style marinated fried chicken - crispy outside, juicy inside.', 250, 'agenomo', true, true),
  ('Ebi Tempura', 'Classic shrimp tempura with light, crispy batter.', 230, 'agenomo', false, true),
  ('Kani Salad', 'Fresh crab stick salad with Japanese mayo and crisp vegetables.', 260, 'agenomo', false, true),
  ('Kakiage', 'Mixed vegetable and seafood tempura fritter.', 220, 'agenomo', false, true),
  ('Age Gyoza', 'Deep-fried Japanese dumplings with crispy exterior.', 195, 'agenomo', true, true),
  ('Yaki Gyoza', 'Pan-fried Japanese dumplings with perfectly crispy bottom.', 195, 'agenomo', true, true);

-- Insert Sushi / Maki / Sashimi Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Dragon Roll', 'Premium sushi roll topped with avocado and eel, resembling a dragon.', 285, 'sushi', true, true),
  ('Tuna Roll', 'Fresh tuna wrapped in seasoned rice and nori seaweed.', 245, 'sushi', false, true),
  ('California Maki', 'Classic inside-out roll with crab, avocado, and cucumber.', 250, 'sushi', true, true),
  ('Tuna / Salmon Sashimi', 'Fresh sliced premium tuna or salmon sashimi.', 400, 'sushi', true, true),
  ('Flamed California', 'California roll with torched topping for added flavor.', 260, 'sushi', false, true),
  ('Mt. Fuji Roll', 'Signature roll inspired by Japan''s iconic mountain.', 285, 'sushi', true, true),
  ('Ebi Roll', 'Fresh shrimp sushi roll with traditional ingredients.', 285, 'sushi', false, true),
  ('Sushi Sample', 'Assorted sushi selection perfect for trying various flavors.', 225, 'sushi', false, true),
  ('Cheesy Mango Maki', 'Unique fusion roll combining sweet mango with creamy cheese.', 225, 'sushi', false, true);

-- Insert Platter Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Sushi Cake (20 PCS)', 'Beautiful layered sushi cake with 20 pieces - perfect for celebrations.', 670, 'platter', true, true),
  ('Sushi Platter (30 PCS)', 'Large sushi assortment with 30 pieces for sharing.', 860, 'platter', true, true),
  ('Sushi Platter (20 PCS)', 'Sushi assortment with 20 pieces ideal for small groups.', 670, 'platter', false, true);

-- Insert Set Meal Items
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Set Meal (Good for 4 Pax)', 'Complete meal for 4 people: 2 Shoyu Ramen Regular, Tendon, Gyudon, California Maki, and Iced Tea Pitcher. The perfect sharing experience.', 1299, 'set-meal', true, true);

