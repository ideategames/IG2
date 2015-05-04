#!/bin/bash

# modify this directory to the directory enclosing the games
cd /home/www-data/../IG2/$1/
rm $1_net.js
/usr/local/lib/node_modules/uglify-js/bin/uglifyjs -c -o $1_net.js *.js