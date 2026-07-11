# Deploy a Oracle Cloud

## Cómo funciona

`git push`/merge a `main` dispara [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

1. **checks** — `tsc` de backend y frontend. Si no compila, no sigue.
2. **build-and-push** — arma la imagen con el [`Dockerfile`](../Dockerfile) raíz y la sube a GitHub Container Registry como `:latest` y `:<sha del commit>`.
3. **deploy** — se conecta por SSH al servidor, hace `docker compose pull` + corre las migraciones + `docker compose up -d`, y espera a que el healthcheck del contenedor pase. Si algo falla, el workflow queda en rojo y el servidor sigue corriendo la versión anterior (no se toca nada hasta que `up -d` se ejecuta con éxito).

## Secrets que hay que cargar en GitHub

`Settings → Secrets and variables → Actions` del repo:

| Nombre | Qué es |
|---|---|
| `ORACLE_HOST` | IP pública de la instancia |
| `ORACLE_SSH_USER` | usuario SSH (ej. `ubuntu`) |
| `ORACLE_SSH_KEY` | clave privada del par que uses **solo** para deploys (no tu clave personal) |
| `ORACLE_SSH_PORT` | opcional, default `22` |

Variable (no secreta, `Variables` en esa misma sección): `VITE_GA_ID` si querés Google Analytics en prod.

`GITHUB_TOKEN` no hace falta cargarlo: lo provee GitHub automáticamente en cada run, con permiso de push/pull a ghcr.io ya habilitado por el `permissions:` del job.

## Setup único del servidor (antes del primer deploy)

```bash
# 1. Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
# cerrar sesión y volver a entrar para que el grupo tome efecto

# 2. Directorio de la app
mkdir -p ~/app/deploy
cd ~/app
```

Copiar a `~/app/` (por `scp` o pegando el contenido):
- [`docker-compose.prod.yml`](../docker-compose.prod.yml) del repo, tal cual.
- [`deploy/Caddyfile`](Caddyfile), con el dominio real reemplazado.
- Un `.env` armado a partir de [`.env.production.example`](../.env.production.example), con contraseñas generadas (`openssl rand -base64 32`) — **este archivo nunca va al repo**.

```bash
# 3. Firewall — abrir 80/443 en dos capas (típico gotcha de OCI):
#    a) Security List / NSG de la VCN, desde la consola de Oracle Cloud.
#    b) iptables del propio SO:
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save   # o el equivalente de tu imagen

# 4. Primer arranque manual (valida que todo esté bien antes de dejarlo en manos de CI)
cd ~/app
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml run --rm app npm run migrate --workspace db
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
```

A partir de acá, cada merge a `main` redeploya solo.

## Rollback manual

Las imágenes quedan taggeadas por SHA en ghcr.io. Para volver a una versión anterior:

```bash
cd ~/app
export APP_IMAGE=ghcr.io/augusto539/web-boletin-oficial:<sha-anterior>
docker compose -f docker-compose.prod.yml up -d
```
