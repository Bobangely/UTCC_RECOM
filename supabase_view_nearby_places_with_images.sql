-- View: ดูรูปภาพพร้อมชื่อสถานที่ (รันใน Supabase SQL Editor)
-- 1. สร้าง View เพื่อดูรูปพร้อมชื่อร้าน/สถานที่
CREATE OR REPLACE VIEW nearby_places_with_images AS
SELECT 
    p.id AS place_id,
    p.name AS place_name,
    p.category,
    p.latitude,
    p.longitude,
    i.image_url,
    i.nearby_place_id
FROM nearby_places p
LEFT JOIN nearby_place_images i ON p.id = i.nearby_place_id;

-- 2. หรือ สร้าง View แบบ JSON รวมรูปทั้งหมดของแต่ละสถานที่
CREATE OR REPLACE VIEW nearby_places_with_image_list AS
SELECT 
    p.id,
    p.name AS place_name,
    p.category,
    p.latitude,
    p.longitude,
    COALESCE(
        json_agg(i.image_url) FILTER (WHERE i.image_url IS NOT NULL),
        '[]'::json
    ) AS images
FROM nearby_places p
LEFT JOIN nearby_place_images i ON p.id = i.nearby_place_id
GROUP BY p.id, p.name, p.category, p.latitude, p.longitude;

-- 3. Query ดูสถานที่ที่มีรูป (inner join)
-- SELECT * FROM nearby_places_with_images WHERE image_url IS NOT NULL;

-- 4. Query ดูสถานที่ที่ยังไม่มีรูป
-- SELECT * FROM nearby_places_with_images WHERE image_url IS NULL;
