-- Insert sample canteen items
INSERT INTO public.canteen_items (name, description, price, category, available) VALUES
('Chicken Sandwich', 'Grilled chicken with lettuce and tomato', 8.99, 'Main Course', true),
('Veggie Burger', 'Plant-based burger with fresh vegetables', 7.99, 'Main Course', true),
('Caesar Salad', 'Fresh romaine lettuce with caesar dressing', 6.99, 'Salads', true),
('Chocolate Chip Cookie', 'Freshly baked chocolate chip cookie', 2.99, 'Desserts', true),
('Coffee', 'Freshly brewed coffee', 3.99, 'Beverages', true),
('Orange Juice', 'Fresh squeezed orange juice', 4.99, 'Beverages', true),
('Pizza Slice', 'Cheese pizza slice', 5.99, 'Main Course', true),
('Fruit Bowl', 'Mixed seasonal fruits', 4.99, 'Healthy Options', true);

-- Insert sample announcements (will be created by admin users after they sign up)
-- These will be added through the UI once admin users are created
