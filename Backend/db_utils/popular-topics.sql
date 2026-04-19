WITH most_favorited AS (
    -- Most forked/favorited recipes and their tags
    SELECT 
        rt.tag_id,
        COUNT(DISTINCT f.user_id) AS favorite_signal
    FROM favorite f
    JOIN recipe_tags rt ON rt.recipe_id = f.recipe_id
    GROUP BY rt.tag_id
),
most_frequent_tags AS (
    -- Top food tags by how often they appear across all recipes
    SELECT 
        tag_id,
        COUNT(*) AS frequency_signal
    FROM recipe_tags
    GROUP BY tag_id
),
interest_profile AS (
    -- Combine both signals
    SELECT 
        t.id,
        t.tag_name,
        COALESCE(mf.favorite_signal, 0)   AS favorite_signal,
        COALESCE(ft.frequency_signal, 0)  AS frequency_signal,
        (
            (COALESCE(mf.favorite_signal, 0) * 0.6) +
            (COALESCE(ft.frequency_signal, 0) * 0.4)
        ) AS interest_score
    FROM tags t
    LEFT JOIN most_favorited mf ON mf.tag_id = t.id
    LEFT JOIN most_frequent_tags ft ON ft.tag_id = t.id
)
SELECT 
    id,
    tag_name,
    favorite_signal,
    frequency_signal,
    interest_score,
    COUNT(DISTINCT rt.recipe_id) AS recipe_count
FROM interest_profile ip
JOIN recipe_tags rt ON rt.tag_id = ip.id
GROUP BY ip.id, ip.tag_name, ip.favorite_signal, ip.frequency_signal, ip.interest_score
ORDER BY interest_score DESC
LIMIT 10;