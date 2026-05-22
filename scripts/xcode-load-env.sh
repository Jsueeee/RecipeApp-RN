#!/bin/sh

# Source this file from Xcode build phases to export key/value pairs from an
# Expo-style .env file without printing values into the build log.

env_file=${1:-}

if [ -z "$env_file" ] || [ ! -f "$env_file" ]; then
  return 0 2>/dev/null || exit 0
fi

trim() {
  printf "%s" "$1" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//'
}

cr=$(printf '\r')

while IFS= read -r raw_line || [ -n "$raw_line" ]; do
  line=${raw_line%"$cr"}
  line=$(trim "$line")

  case "$line" in
    ""|\#*) continue ;;
  esac

  case "$line" in
    *=*) ;;
    *) continue ;;
  esac

  key=$(trim "${line%%=*}")
  value=$(trim "${line#*=}")

  case "$key" in
    ""|[0-9]*|*[!A-Za-z0-9_]*) continue ;;
  esac

  case "$value" in
    \"*\") value=${value#\"}; value=${value%\"} ;;
    \'*\') value=${value#\'}; value=${value%\'} ;;
  esac

  export "$key=$value"
done < "$env_file"

export RECIPEAPP_XCODE_ENV_FILE="$env_file"
