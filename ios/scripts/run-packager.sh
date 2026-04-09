#!/bin/bash

# This script is executed from Xcode to start the React packager for Debug
# targets.

THIS_DIR=$(cd -P "$(dirname "$(readlink "${BASH_SOURCE[0]}" || echo "${BASH_SOURCE[0]}")")" && pwd)

export RCT_METRO_PORT="${RCT_METRO_PORT:=8081}"
# Some setups end up with root-owned `node_modules` (e.g. after running `sudo npx ...`),
# which makes this write fail and breaks the Xcode build. Treat this as best-effort.
PACKAGER_ENV_PATH="${SRCROOT}/../../node_modules/react-native/scripts/.packager.env"
if ! echo "export RCT_METRO_PORT=${RCT_METRO_PORT}" > "${PACKAGER_ENV_PATH}" 2>/dev/null; then
  echo "warning: unable to write ${PACKAGER_ENV_PATH}" >&2
fi

if [[ "$CONFIGURATION" = "Debug" ]]; then
  if nc -w 5 -z localhost ${RCT_METRO_PORT} ; then
    # `curl` without a timeout can hang the entire Xcode build if something else is
    # listening on the port or Metro is stuck. Keep this phase fast and deterministic.
    if ! curl -s --connect-timeout 2 --max-time 3 "http://localhost:${RCT_METRO_PORT}/status" | grep -q "packager-status:running" ; then
      echo "Port ${RCT_METRO_PORT} already in use, packager is either not running or not running correctly"
      echo "Start Metro manually with: npx react-native start --port ${RCT_METRO_PORT}"
      exit 2
    fi
  else
    open -g "$THIS_DIR/run-packager-helper.command" || echo "Can't start packager automatically"
  fi
fi
