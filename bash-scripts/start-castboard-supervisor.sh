#!/bin/bash

until /castboard/castboard; do
    echo "Castboard crashed with exit code $?. Respawning..." >&2
    sleep 4
done