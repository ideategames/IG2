#!/bin/bash

# modify this directory to the one enclosing the common directory
cd /home/www-data/.../common/js
/usr/local/lib/node_modules/uglify-js/bin/uglifyjs -c -m -o common_net.js IGvars.js utilities.js utilitiesDIV.js comm.js ios-drag-drop.js