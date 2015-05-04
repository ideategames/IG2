#!/bin/bash
cd /Users/davidmarques/prog/Mongoose.app/Contents/IdeateGames/init/static/IG/common/js
~/node_modules/uglify-js/bin/uglifyjs -c -m -o common_net.js IGvars.js utilities.js comm.js