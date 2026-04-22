#!/bin/bash
set -e

cat >> "$PGDATA/postgresql.conf" << 'EOF'

# pgBackRest WAL archiving
archive_mode = on
archive_command = 'pgbackrest --stanza=ingo360 archive-push %p'
archive_timeout = 60
wal_level = replica
EOF

pgbackrest --stanza=ingo360 stanza-create
