#!/bin/bash

SCRIPTDIR=$(dirname $0)
. $SCRIPTDIR/../configs/repo.conf
. $SCRIPTDIR/../shared/common.sh
. $SCRIPTDIR/../shared/repo/${REPO}.sh

BUNDLE=$1
ARTIFACT=$2

if [ -z "$SRC_DIR" ]; then
  SRC_DIR=${JENKINS_WORKSPACE}
fi

if [ -z "$BUNDLE" ]; then
  echo "Usage: $0 <bundle> (<artifact>)"
  exit 1
fi
set -e
validateBundle $BUNDLE

getBundleFolder $BUNDLE
IFSOLD=$IFS

echo "Copying artifacts into bundle.."
IFS=";"
echo -n "  "
exec 3< $SCRIPTDIR/../configs/artifacts.csv
while read -u 3 src dst; do
  IFS=$IFSOLD
  if [ -z "$ARTIFACT" -o "$ARTIFACT" = "$src" -o "$ARTIFACT" = "$(basename $src)" ]; then
    copyArtifact ${SRC_DIR}/$src $dst
    echo -n "."
  fi
  IFS";"
done
exec 3<&-
echo
IFS=$IFSOLD
echo "done."
