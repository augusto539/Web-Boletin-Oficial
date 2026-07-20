# Instalación del job diario en Oracle Cloud

## Prerrequisitos

- Python 3.11+ en la instancia.
- Postgres alcanzable desde la instancia (misma base que usa la app web,
  `boletin_sociedades`), **ya con el schema y el histórico migrados** (via
  `crear_tablas.py` + `migrar_a_postgres.py`, corridos antes desde donde sea
  que se hizo la migración inicial — este job diario no reemplaza eso, solo
  agrega desde el día en que arranca).

## Qué sincronizar antes del primer arranque

El repo tiene varias carpetas de datos en `.gitignore` (no viajan con `git
clone`). Para el job diario hace falta, como mínimo:

1. **`PDFs/boletines/ids_boletines.json`** — el mapeo nombre-de-archivo → ID de
   edición. Es un archivo chico (no los 2300+ PDFs históricos, no hace falta
   copiarlos: como ya están todos cargados en Postgres, el orquestador nunca
   los va a volver a pedir). Sin este archivo, `Descargar boletines.py`
   empezaría a redescubrir ediciones desde el ID semilla original en vez de
   seguir desde la última conocida.
   ```bash
   scp "PDFs/boletines/ids_boletines.json" usuario@instancia:/opt/boletin-oficial/PDFs/boletines/
   ```

Los padrones ARCA (`Padrón sociedades.csv` y `CLAEsMendoza.csv`) **ya no hace
falta sincronizarlos** — `job diario/actualizar_padrones_arca.py` los descarga
y regenera solo (dos URLs públicas, sin credenciales), y se borran después de
cada uso (se regeneran frescos la próxima corrida con boletines nuevos).

## Instalación

```bash
# 1. Clonar el repo (ajustar la ruta si no es /opt/boletin-oficial)
sudo git clone <url-del-repo> /opt/boletin-oficial
cd /opt/boletin-oficial

# 2. Entorno virtual + dependencias (mismo requirements.txt de siempre)
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

# 3. Variables de entorno
cp "job diario/deploy/.env.example" "job diario/deploy/.env"
nano "job diario/deploy/.env"   # completar ANTHROPIC_API_KEY, DATABASE_URL, etc.

# 4. Sincronizar ids_boletines.json (paso anterior) antes de seguir.

# 5. Instalar el service + timer de systemd
sudo cp "job diario/deploy/job-diario.service" /etc/systemd/system/
sudo cp "job diario/deploy/job-diario.timer" /etc/systemd/system/
sudo systemctl daemon-reload

# 6. Probar UNA corrida manual antes de confiar en el timer
sudo systemctl start job-diario.service
journalctl -u job-diario.service -f   # seguir el log en vivo

# 7. Si la corrida manual salió bien, activar el timer
sudo systemctl enable --now job-diario.timer
systemctl list-timers job-diario.timer   # confirmar la próxima ejecución programada
```

## Verificar que sigue corriendo (uso normal)

```bash
# Última corrida (heartbeat, actualizado por run_diario.py en cada ejecución)
cat "/opt/boletin-oficial/job diario/heartbeat.json"

# Logs de las últimas corridas
journalctl -u job-diario.service --since "7 days ago"

# Próximo disparo programado
systemctl list-timers job-diario.timer
```

Si falla, además de quedar en `heartbeat.json` con `"ok": false`, llega un mail
vía Resend a `ALERTA_EMAIL_TO` — configurar esa dirección como **VIP en la app
Mail de iOS** (Contactos → marcar como VIP, o desde el propio mail recibido →
"Agregar a VIP") para que suene sola aunque el resto de las notificaciones esté
silenciado.

## Notas

- El `WorkingDirectory`/`ExecStart` del `.service` asumen `/opt/boletin-oficial`
  — si se clona en otra ruta, editar esas dos líneas (y las rutas de
  `EnvironmentFile`) antes de copiarlo a `/etc/systemd/system/`.
- El horario del `.timer` (15:30 UTC = 12:30 hora Mendoza) asume que la
  instancia tiene el reloj en UTC — confirmar con `timedatectl` y ajustar
  `OnCalendar` si no es así.
- Nada de este despliegue se hizo automáticamente: estos archivos son para que
  vos los instales en tu instancia real, siguiendo los pasos de arriba.
