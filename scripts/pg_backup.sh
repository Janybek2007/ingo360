#!/bin/sh
set -eu

STANZA="ingo360"
DOW=$(date +%u)   # 1=Mon ... 7=Sun
DOM=$(date +%d)   # 01-31

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Full: каждое воскресенье и 1-е число месяца
# Differential: все остальные дни
if [ "$DOM" = "01" ] || [ "$DOW" = "7" ]; then
  TYPE="full"
else
  TYPE="diff"
fi

log "[$TYPE] Starting backup (stanza: $STANZA)"
su-exec postgres pgbackrest --stanza="$STANZA" --type="$TYPE" backup
su-exec postgres pgbackrest --stanza="$STANZA" info
log "All done"
