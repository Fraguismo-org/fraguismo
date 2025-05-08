REPLACE INTO `rating_nivel` (`id`, `nivel`, `pontuacao_base`) VALUES
    (1, 'membro', 0),
    (2, 'assessor', 5),
    (3, 'lider', 15),
    (4, 'executivo', 30),
    (5, 'diretor', 40);

REPLACE INTO `rating_nivel` (`id`, `nivel`, `pontuacao_base`) VALUES
    (1, 'aprendiz', 0),
    (2, 'escudeiro', 5),
    (3, 'cavaleiro', 15),
    (4, 'conselheiro', 30),
    (5, 'guardião', 40);

UPDATE `members_profile` SET `nivel` = CASE
	WHEN TRIM(`nivel`) = '' THEN 'aprendiz'
    WHEN `nivel` = 'membro' THEN 'aprendiz'
    WHEN `nivel` = 'assessor' THEN 'escudeiro'
    WHEN `nivel` = 'lider' THEN 'cavaleiro'
    WHEN `nivel` = 'executivo' THEN 'conselheiro'
    WHEN `nivel` = 'diretor' THEN 'guardião'
    ELSE `nivel`
END
WHERE user_id <> NULL;