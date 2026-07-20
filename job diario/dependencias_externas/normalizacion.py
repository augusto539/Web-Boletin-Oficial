"""
normalizacion.py
Normalización de denominaciones societarias para matching por nombre.

Usado por ARCA/Padron/preparar_padron.py, ARCA/Pandas/limpiar_padron.py y
post_procesar_excel.py — una sola implementación para que los tres lados
normalicen exactamente igual (antes estaba duplicada y podía desincronizarse).
"""

import re
import unicodedata


def normalizar_nombre(s: str) -> str:
    """
    Normaliza una denominación para matching:
      - Mayúsculas, sin tildes/acentos
      - S.A.S. / S.A. / S.R.L. / S.A.U. → SAS / SA / SRL / SAU
      - Sin puntuación, espacios colapsados
    """
    s = str(s).upper().strip()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace(".", " ")
    s = re.sub(r"\bS\s+A\s+S\b", "SAS", s)
    s = re.sub(r"\bS\s+A\s+U\b", "SAU", s)
    s = re.sub(r"\bS\s+A\b",     "SA",  s)
    s = re.sub(r"\bS\s+R\s+L\b", "SRL", s)
    s = re.sub(r"\bS\s+C\b",     "SC",  s)
    s = re.sub(r"[^A-Z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s
