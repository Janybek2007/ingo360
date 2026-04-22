#!/bin/sh
set -e

if [ -n "${BACKUP_PASSPHRASE:-}" ]; then
  sed -i "s|__CIPHER_PASS__|${BACKUP_PASSPHRASE}|" /etc/pgbackrest/pgbackrest.conf
fi

crond -b -d 8

exec docker-entrypoint.sh "$@"
