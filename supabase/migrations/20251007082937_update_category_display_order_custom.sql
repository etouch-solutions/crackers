/*
  # Update Category Display Order - Custom Order

  1. Changes
    - Set specific display_order values for each category based on desired display sequence
    - Categories will appear in the exact order specified by the user

  2. Category Order (highest to lowest display_order)
    1. SPARKLERS (கம்பி மத்தாப்பு)
    2. FLOWER POTS (புஸ்வானம்)
    3. CRACKLING FOUNTIONS (கிராக்ளிங் ஃபவுண்டேன்ஸ்)
    4. CHAKKER (சங்கு சக்கரம்)
    5. MULTI COLOUR FLOWER POTS
    6. 2025 VANITHA BRAND SPECIAL (வனிதா பிராண்ட் ஸ்பெஷல்)
    7. PLASTIC CHAKKER SPECIAL 2025 (ஸ்பெஷல் சங்குசக்கரம்)
    8. TWINKLING STAR (சாட்டை)
    9. ONE SOUND CRACKERS (வெடி)
    10. BIJILI CRACKERS (பிஜிலி வெடி)
    11. SKY ROCKETS (ராக்கெட்)
    12. CAT Brand Fountain +Jumping Chakkar
    13. MEGA MULTI COLOUR SHOTS (மேகா மல்டி கலர் ஷாட்ஸ்)
    14. MEGA SKY DISPLAY FANCY (மேகா ஸ்கை டிஸ்ப்ளே ஃபான்சி)
    15. MINI TRAIL FANCY (மினி ட்ரெயில் ஃபான்சி)
    16. 180FOUNTAINS (180° கலர் ஃபவுண்டேன்ஸ்)
    17. NEW COLLECTION WALAS (புதிய வரவு வாலாஸ்)
    18. CHILDRENS SPECIAL FANCY (சில்ட்ரன்ஸ் ஸ்பெஷல் ஃபான்சி)
    19. COLOUR MATCHS (வண்ண தீப்பெட்டிகள்)
    20. PAPPER BOMB (பேப்பர் பாம்)
*/

-- Reset all display_order to 0 first
UPDATE categories SET display_order = 0;

-- Set display_order based on desired sequence (using descending order)
-- Since we sort by descending, higher numbers appear first

UPDATE categories SET display_order = 20 WHERE LOWER(name) LIKE '%sparkler%' OR LOWER(name) LIKE '%கம்பி மத்தாப்பு%';
UPDATE categories SET display_order = 19 WHERE LOWER(name) LIKE '%flower pot%' AND NOT LOWER(name) LIKE '%multi%' OR LOWER(name) LIKE '%புஸ்வானம்%';
UPDATE categories SET display_order = 18 WHERE LOWER(name) LIKE '%crackling%' AND LOWER(name) LIKE '%fountain%' OR LOWER(name) LIKE '%கிராக்ளிங்%';
UPDATE categories SET display_order = 17 WHERE LOWER(name) LIKE '%chakker%' AND NOT LOWER(name) LIKE '%plastic%' AND NOT LOWER(name) LIKE '%cat brand%' OR LOWER(name) LIKE '%சங்கு சக்கரம்%';
UPDATE categories SET display_order = 16 WHERE LOWER(name) LIKE '%multi%' AND LOWER(name) LIKE '%colour%' AND LOWER(name) LIKE '%flower pot%';
UPDATE categories SET display_order = 15 WHERE LOWER(name) LIKE '%2025%' AND LOWER(name) LIKE '%vanitha%' OR LOWER(name) LIKE '%வனிதா பிராண்ட்%';
UPDATE categories SET display_order = 14 WHERE LOWER(name) LIKE '%plastic%' AND LOWER(name) LIKE '%chakker%' AND LOWER(name) LIKE '%2025%' OR LOWER(name) LIKE '%ஸ்பெஷல் சங்கு%';
UPDATE categories SET display_order = 13 WHERE LOWER(name) LIKE '%twinkling star%' OR LOWER(name) LIKE '%சாட்டை%';
UPDATE categories SET display_order = 12 WHERE LOWER(name) LIKE '%one sound%' OR LOWER(name) LIKE '%வெடி%' AND NOT LOWER(name) LIKE '%bijili%';
UPDATE categories SET display_order = 11 WHERE LOWER(name) LIKE '%bijili%' OR LOWER(name) LIKE '%பிஜிலி%';
UPDATE categories SET display_order = 10 WHERE LOWER(name) LIKE '%sky rocket%' OR LOWER(name) LIKE '%ராக்கெட்%' OR (LOWER(name) = 'rockets' OR LOWER(name) LIKE 'rocket');
UPDATE categories SET display_order = 9 WHERE LOWER(name) LIKE '%cat brand%' AND LOWER(name) LIKE '%fountain%';
UPDATE categories SET display_order = 8 WHERE LOWER(name) LIKE '%mega%' AND LOWER(name) LIKE '%multi%' AND LOWER(name) LIKE '%colour%' AND LOWER(name) LIKE '%shot%';
UPDATE categories SET display_order = 7 WHERE LOWER(name) LIKE '%mega%' AND LOWER(name) LIKE '%sky%' AND LOWER(name) LIKE '%display%';
UPDATE categories SET display_order = 6 WHERE LOWER(name) LIKE '%mini%' AND LOWER(name) LIKE '%trail%';
UPDATE categories SET display_order = 5 WHERE LOWER(name) LIKE '%180%' AND LOWER(name) LIKE '%fountain%';
UPDATE categories SET display_order = 4 WHERE LOWER(name) LIKE '%new collection%' AND LOWER(name) LIKE '%wala%';
UPDATE categories SET display_order = 3 WHERE LOWER(name) LIKE '%children%' OR LOWER(name) LIKE '%சில்ட்ரன்%';
UPDATE categories SET display_order = 2 WHERE LOWER(name) LIKE '%colour match%' OR LOWER(name) LIKE '%வண்ண தீப்பெட்டி%';
UPDATE categories SET display_order = 1 WHERE LOWER(name) LIKE '%papper%' OR LOWER(name) LIKE '%paper%' AND LOWER(name) LIKE '%bomb%';
