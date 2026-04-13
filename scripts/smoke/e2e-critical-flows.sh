#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

WEB_PORT="${WEB_PORT:-3000}"
CLIENT_PORT="${CLIENT_PORT:-3001}"

WEB_BASE_URL="http://127.0.0.1:${WEB_PORT}"
CLIENT_BASE_URL="http://127.0.0.1:${CLIENT_PORT}"

TMP_DIR="$(mktemp -d)"
WEB_LOG="$TMP_DIR/web.log"
CLIENT_LOG="$TMP_DIR/cliente.log"
WEB_HEADERS="$TMP_DIR/web.headers"
CLIENT_HEADERS="$TMP_DIR/cliente.headers"
BODY_FILE="$TMP_DIR/body.json"

WEB_PID=""
CLIENT_PID=""

cleanup() {
  if [ -n "$WEB_PID" ] && kill -0 "$WEB_PID" >/dev/null 2>&1; then
    kill "$WEB_PID" >/dev/null 2>&1 || true
  fi
  if [ -n "$CLIENT_PID" ] && kill -0 "$CLIENT_PID" >/dev/null 2>&1; then
    kill "$CLIENT_PID" >/dev/null 2>&1 || true
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

wait_for_url() {
  local url="$1"
  local timeout_seconds="${2:-60}"
  local start
  start="$(date +%s)"

  while true; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    if [ "$(($(date +%s) - start))" -ge "$timeout_seconds" ]; then
      echo "FAIL: timeout esperando $url"
      return 1
    fi
    sleep 1
  done
}

expect_http_code() {
  local code="$1"
  local expected="$2"
  local label="$3"
  if [ "$code" != "$expected" ]; then
    echo "FAIL: $label (esperado $expected, recibido $code)"
    exit 1
  fi
}

expect_file_contains() {
  local file="$1"
  local pattern="$2"
  local label="$3"
  if ! grep -Fq "$pattern" "$file"; then
    echo "FAIL: $label"
    echo "  Missing: $pattern"
    echo "  File: $file"
    exit 1
  fi
}

expect_header_location_contains() {
  local headers_file="$1"
  local pattern="$2"
  local label="$3"
  if ! grep -i '^location:' "$headers_file" | grep -Fq "$pattern"; then
    echo "FAIL: $label"
    echo "  Missing location pattern: $pattern"
    echo "  Headers:"
    cat "$headers_file"
    exit 1
  fi
}

echo "[0/6] Build de producción..."
pnpm build >/dev/null

echo "[1/6] Iniciando web..."
pnpm --filter web exec next start -p "$WEB_PORT" >"$WEB_LOG" 2>&1 &
WEB_PID="$!"

echo "[2/6] Iniciando cliente..."
(
  NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-https://example.supabase.co}" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-anon-key-for-smoke}" \
  pnpm --filter cliente exec next start -p "$CLIENT_PORT"
) >"$CLIENT_LOG" 2>&1 &
CLIENT_PID="$!"

wait_for_url "$WEB_BASE_URL" 90
wait_for_url "$CLIENT_BASE_URL" 90

echo "[3/6] Test web contacto: content-type inválido..."
HTTP_CODE="$(curl -sS -o "$BODY_FILE" -w "%{http_code}" \
  -X POST "$WEB_BASE_URL/api/contacto" \
  -H "content-type: text/plain" \
  --data "hola")"
expect_http_code "$HTTP_CODE" "400" "contacto invalid content-type"
expect_file_contains "$BODY_FILE" "invalid_content_type" "contacto invalid content-type payload"

echo "[4/6] Test web contacto: falta email..."
HTTP_CODE="$(curl -sS -o "$BODY_FILE" -w "%{http_code}" \
  -X POST "$WEB_BASE_URL/api/contacto" \
  -H "content-type: application/json" \
  --data '{"name":"Test","message":"Hola mundo"}')"
expect_http_code "$HTTP_CODE" "400" "contacto missing email"
expect_file_contains "$BODY_FILE" "missing_email" "contacto missing email payload"

echo "[5/6] Test cliente approve: id inválido..."
HTTP_CODE="$(curl -sS -D "$CLIENT_HEADERS" -o /dev/null -w "%{http_code}" \
  -X POST "$CLIENT_BASE_URL/admin/leads/abc/approve")"
if [ "$HTTP_CODE" != "307" ] && [ "$HTTP_CODE" != "308" ] && [ "$HTTP_CODE" != "303" ]; then
  echo "FAIL: approve invalid id redirect (esperado 307/308/303, recibido $HTTP_CODE)"
  exit 1
fi
expect_header_location_contains "$CLIENT_HEADERS" "leadError=invalid-id" "approve invalid id redirect location"

echo "[6/6] Test cliente portal guard: usuario no autenticado..."
HTTP_CODE="$(curl -sS -D "$CLIENT_HEADERS" -o /dev/null -w "%{http_code}" "$CLIENT_BASE_URL/portal")"
if [ "$HTTP_CODE" != "307" ] && [ "$HTTP_CODE" != "308" ] && [ "$HTTP_CODE" != "303" ]; then
  echo "FAIL: portal guard redirect (esperado 307/308/303, recibido $HTTP_CODE)"
  exit 1
fi
expect_header_location_contains "$CLIENT_HEADERS" "/acceso" "portal guard redirect location"

echo "OK: e2e critical flows passed."
