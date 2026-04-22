#!/bin/sh
set -e

HOOK_FILE="/hooks/reload"
LAST_MTIME=0

nginx -g "daemon off;" &
NGINX_PID=$!

trap "nginx -s quit; wait $NGINX_PID; exit 0" TERM INT

while kill -0 $NGINX_PID 2>/dev/null; do
  sleep 30
  if [ -f "$HOOK_FILE" ]; then
    MTIME=$(stat -c %Y "$HOOK_FILE")
    if [ "$MTIME" != "$LAST_MTIME" ]; then
      nginx -s reload
      LAST_MTIME=$MTIME
    fi
  fi
done
