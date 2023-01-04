#!/bin/bash

# Random UUID generator, which should be portable to any OS able to run bash

printf "%04x%04x-%04x-%04x-%04x-%04x%04x%04x\n" \
$RANDOM $RANDOM \
$RANDOM \
$(($RANDOM & 0x0fff | 0x4000)) \
$(($RANDOM & 0x3fff | 0x8000)) \
$RANDOM $RANDOM $RANDOM