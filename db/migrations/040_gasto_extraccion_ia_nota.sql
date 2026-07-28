-- Columna opcional para dejar registrado el motivo de una fila que no viene
-- de una corrida real del job diario (ej. un ajuste manual con el gasto
-- acumulado de antes de que existiera esta tabla) -- sin esto, una fila con
-- llamadas=0 pero costo_usd>0 no se explica sola.
ALTER TABLE gasto_extraccion_ia ADD COLUMN nota text;
