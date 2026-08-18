#!/bin/bash

set -e

THIS_DIR=$(cd -P "$(dirname "$(readlink "${BASH_SOURCE[0]}" || echo "${BASH_SOURCE[0]}")")" && pwd)
PROJECT_ROOT=$(cd "${THIS_DIR}/../.." && pwd)

PORT="${RCT_METRO_PORT:-8081}"

cd "${PROJECT_ROOT}"

echo "Starting Metro (React Native packager) on port ${PORT}"
exec node node_modules/react-native/cli.js start --port "${PORT}"

