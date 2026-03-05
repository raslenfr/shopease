# ─────────────────────────────────────────────────────────────────────────────
# ShopEase — Keycloak Setup Guide
# ─────────────────────────────────────────────────────────────────────────────

## ⚠️ PREREQUISITE: Start Docker Desktop
# Open Docker Desktop from the Start Menu or taskbar and wait until it says
# "Docker Desktop is running" (the whale icon should be solid in the taskbar).

## ─────────────────────────────────────────────────────────────────────────────
## STEP 1: Start Keycloak with realm auto-import
## ─────────────────────────────────────────────────────────────────────────────

# Run this command from any terminal:

docker run -d `
  --name keycloak-shopease `
  -p 8180:8080 `
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin `
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin `
  -v C:\Users\MSI\.gemini\antigravity\scratch\shopease\keycloak\shopease-realm.json:/opt/keycloak/data/import/shopease-realm.json `
  quay.io/keycloak/keycloak:24.0 `
  start-dev --import-realm

# ─────────────────────────────────────────────────────────────────────────────
# What this does:
#   -d                    → Run in background (detached)
#   --name                → Container name for easy management
#   -p 8180:8080          → Expose Keycloak on port 8180 (avoids conflict with gateway)
#   KC_BOOTSTRAP_ADMIN_*  → Master admin credentials (Keycloak admin console)
#   -v ... realm.json     → Mounts our realm file for auto-import
#   start-dev             → Dev mode (HTTP, no TLS — fine for development)
#   --import-realm        → Import any .json files found in /opt/keycloak/data/import/
# ─────────────────────────────────────────────────────────────────────────────


## ─────────────────────────────────────────────────────────────────────────────
## STEP 2: Wait for Keycloak to start (~30-60 seconds)
## ─────────────────────────────────────────────────────────────────────────────

# Check logs until you see "Keycloak 24.0... started":
docker logs -f keycloak-shopease

# You should see:
#   [org.keycloak.services] (main) KC-SERVICES0034: Export of realm 'shopease' requested.
#   [io.quarkus] (main) Keycloak 24.0.x ... started in Xs


## ─────────────────────────────────────────────────────────────────────────────
## STEP 3: Verify Admin Console Access
## ─────────────────────────────────────────────────────────────────────────────

# Open: http://localhost:8180
# Click "Administration Console"
# Login with: admin / admin  (these are MASTER realm admin creds)
#
# Navigate to: Realm dropdown (top-left) → Select "shopease"
# You should see: ShopEase E-Commerce realm loaded


## ─────────────────────────────────────────────────────────────────────────────
## STEP 4: Verify Realm Configuration
## ─────────────────────────────────────────────────────────────────────────────

# CHECK CLIENTS:
#   Left menu → Clients
#   Should see: shopease-angular (public), shopease-gateway (confidential)

# CHECK ROLES:
#   Left menu → Realm roles
#   Should see: ROLE_USER, ROLE_ADMIN

# CHECK USERS:
#   Left menu → Users → Click "View all users"
#   Should see:
#     alice (alice@shopease.com) → Role: ROLE_USER
#     admin (admin@shopease.com) → Role: ROLE_ADMIN


## ─────────────────────────────────────────────────────────────────────────────
## STEP 5: Test Token Issuance (verify alice can login)
## ─────────────────────────────────────────────────────────────────────────────

# Use curl or Postman to get a token using Resource Owner Password Grant
# (directAccessGrantsEnabled = true on both clients):

# PowerShell:
$body = @{
  grant_type = "password"
  client_id  = "shopease-angular"
  username   = "alice"
  password   = "alice123"
}
$response = Invoke-RestMethod -Uri "http://localhost:8180/realms/shopease/protocol/openid-connect/token" -Method POST -Body $body
$response.access_token

# Decode the token at https://jwt.io to verify the structure.


## ─────────────────────────────────────────────────────────────────────────────
## STEP 6: Test Admin Token
## ─────────────────────────────────────────────────────────────────────────────

$body = @{
  grant_type = "password"
  client_id  = "shopease-angular"
  username   = "admin"
  password   = "admin123"
}
$response = Invoke-RestMethod -Uri "http://localhost:8180/realms/shopease/protocol/openid-connect/token" -Method POST -Body $body
$response.access_token


## ─────────────────────────────────────────────────────────────────────────────
## MANAGEMENT COMMANDS
## ─────────────────────────────────────────────────────────────────────────────

# Stop:   docker stop keycloak-shopease
# Start:  docker start keycloak-shopease
# Remove: docker rm -f keycloak-shopease
# Logs:   docker logs -f keycloak-shopease
