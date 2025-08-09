#!/usr/bin/env bash
set -euo pipefail
DB_NAME="${1:-online_attendance}"
DB_USER="${PGUSER:-postgres}"
DB_HOST="${PGHOST:-localhost}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="${DIR}/online_attendance.sql"

echo "==> Checking for database '${DB_NAME}'..."
if ! psql -U "${DB_USER}" -h "${DB_HOST}" -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  echo "==> Creating database '${DB_NAME}'..."
  createdb -U "${DB_USER}" -h "${DB_HOST}" "${DB_NAME}"
else
  echo "==> Database exists."
fi

echo "==> Importing SQL..."
psql -U "${DB_USER}" -h "${DB_HOST}" -d "${DB_NAME}" -f "${SQL_FILE}"

echo "==> Done. Run: psql -U ${DB_USER} -h ${DB_HOST} -d ${DB_NAME} -f verify.sql"
