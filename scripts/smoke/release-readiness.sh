#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

check_contains() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  if ! grep -Fq "$pattern" "$file"; then
    echo "FAIL: $label"
    echo "  Missing pattern: $pattern"
    echo "  File: $file"
    exit 1
  fi
}

check_not_contains() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  if grep -Fq "$pattern" "$file"; then
    echo "FAIL: $label"
    echo "  Forbidden pattern found: $pattern"
    echo "  File: $file"
    exit 1
  fi
}

echo "[1/4] Verificando tipografias offline..."
check_not_contains "apps/web/src/app/layout.tsx" "next/font/google" "web layout must not use Google Fonts"
check_not_contains "apps/cliente/src/app/layout.tsx" "next/font/google" "cliente layout must not use Google Fonts"

echo "[2/4] Verificando endpoint de captura de lead..."
check_contains "apps/web/src/app/api/contacto/route.ts" "export async function POST" "contact route must expose POST handler"
check_contains "apps/web/src/app/api/contacto/route.ts" 'requiredFields = ["name", "email", "message"]' "contact route must validate required fields"
check_contains "apps/web/src/app/api/contacto/route.ts" 'redirectTo: "/contacto/enviado"' "contact route must return success redirect"

echo "[3/4] Verificando aprobacion de lead..."
check_contains "apps/cliente/src/app/admin/leads/[id]/approve/route.ts" "export async function POST" "approve route must expose POST handler"
check_contains "apps/cliente/src/app/admin/leads/[id]/approve/route.ts" "leadError=invalid-id" "approve route must guard invalid id"
check_contains "apps/cliente/src/app/admin/leads/[id]/approve/route.ts" "leadApproved=" "approve route must expose success redirect flag"

echo "[4/4] Verificando guardas de acceso al portal..."
check_contains "apps/cliente/src/proxy.ts" "pathname.startsWith('/portal')" "proxy must protect portal path"
check_contains "apps/cliente/src/proxy.ts" "account-not-enabled" "proxy must redirect non-enabled accounts"

echo "OK: release readiness smoke checks passed."
