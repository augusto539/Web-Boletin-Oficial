-- Promueve a fila real de `sociedades` los ~10 socios jurídicos citados en
-- los 4 informes de nichos sectoriales que hoy solo existen como
-- `vinculos.nombre_juridico_fallback` (ver 036_socios_juridicos.sql para el
-- mecanismo de "promoción"). Reproduce, como migración idempotente, lo que
-- se hizo a mano vía POST /api/admin/socios-juridicos/vincular contra la
-- base local — pero matcheando por CUIT/nombre (no por vinculo_id, que es
-- específico de cada entorno y no porta entre local y producción).
--
-- Alcance deliberadamente acotado a estas ~10 empresas (las de los
-- informes); el resto de los ~319 nombres de fallback sitewide quedan para
-- una pasada posterior vía el panel de admin (mecanismo ya reutilizable).
--
-- Nota: "Green S.A." (sociedad_id 10544) y "Proyectos Lavalle..." (397) NO
-- están acá porque el pipeline ya los había resuelto correctamente — no eran
-- fallbacks.

DO $$
DECLARE
  v_sociedad_id bigint;
  v_nombre text;
  v_cuit text;
  v_variantes text[];
  v_filas int;
BEGIN
  -- 1) Dax Energy Holdings S.p.A.
  v_nombre := 'Dax Energy Holdings S.p.A.'; v_cuit := '30715377442';
  v_variantes := ARRAY['Dax Energy Holdings S.p.A.', 'Dax Energy Holdings S.p.A'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 2) Dax Energy Argentina Holdings S.p.A.
  v_nombre := 'Dax Energy Argentina Holdings S.p.A.'; v_cuit := '30715377469';
  v_variantes := ARRAY['Dax Energy Argentina Holdings S.p.A.', 'Dax Energy Argentina Holdings S.p.A'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 3) Tassaroli S.A.
  v_nombre := 'Tassaroli S.A.'; v_cuit := '30629717958';
  v_variantes := ARRAY['Tassaroli S.A.', 'Tassaroli Sociedad Anónima'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 4) Grupo Energías Globales S.A.
  v_nombre := 'Grupo Energías Globales S.A.'; v_cuit := '30715557653';
  v_variantes := ARRAY['Grupo Energías Globales S.A.'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 5) Estación Terminal Mendoza S.A.
  v_nombre := 'Estación Terminal Mendoza S.A.'; v_cuit := '30715450174';
  v_variantes := ARRAY['Estación Terminal Mendoza S.A.'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 6) Laugero Construcciones S.A. (con y sin CUIT informado; arrastra
  --    también las UTs de construcción sin relación con energía citadas por
  --    esta misma empresa real — efecto colateral esperado, ya visto en local).
  v_nombre := 'Laugero Construcciones S.A.'; v_cuit := '30679806374';
  v_variantes := ARRAY['Laugero Construcciones S.A.'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    SELECT id INTO v_sociedad_id FROM sociedades WHERE nombre_normalizado = upper(unaccent(v_nombre)) LIMIT 1;
  END IF;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 7) Obras Andinas S.A. (sin CUIT capturado por el pipeline; variantes
  --    "S.A."/"Sa"/"SA" tratadas como la misma empresa real).
  v_nombre := 'Obras Andinas S.A.'; v_cuit := NULL;
  v_variantes := ARRAY['Obras Andinas S.A.', 'Obras Andinas Sa', 'Obras Andinas SA'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE nombre_normalizado = upper(unaccent(v_nombre)) LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL
    AND upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x);
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 8) Syr Energia Sas
  v_nombre := 'Syr Energia Sas'; v_cuit := NULL;
  v_variantes := ARRAY['Syr Energia Sas'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE nombre_normalizado = upper(unaccent(v_nombre)) LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL
    AND upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x);
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 9) Felito S.A.
  v_nombre := 'Felito S.A.'; v_cuit := '30716039028';
  v_variantes := ARRAY['Felito S.A.'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;

  -- 10) Sueños Salvadores SA
  v_nombre := 'Sueños Salvadores SA'; v_cuit := '30718154044';
  v_variantes := ARRAY['Sueños Salvadores SA'];
  SELECT id INTO v_sociedad_id FROM sociedades WHERE cuit = v_cuit LIMIT 1;
  IF v_sociedad_id IS NULL THEN
    INSERT INTO sociedades (nombre, nombre_normalizado, cuit) VALUES (v_nombre, upper(unaccent(v_nombre)), v_cuit) RETURNING id INTO v_sociedad_id;
  END IF;
  UPDATE vinculos SET sociedad_miembro_id = v_sociedad_id, nombre_juridico_fallback = NULL, cuit_juridico_fallback = NULL
  WHERE nombre_juridico_fallback IS NOT NULL AND (
    regexp_replace(cuit_juridico_fallback, '\D', '', 'g') = v_cuit
    OR upper(unaccent(trim(nombre_juridico_fallback))) = ANY (SELECT upper(unaccent(trim(x))) FROM unnest(v_variantes) x)
  );
  GET DIAGNOSTICS v_filas = ROW_COUNT;
  RAISE NOTICE '% -> sociedad_id % (% vinculos)', v_nombre, v_sociedad_id, v_filas;
END $$;
