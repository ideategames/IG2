# IG2
Game framework for education games with 6 games and sample content.

Source code for 6 games (and 2 in development: Bridges and Adapt)

All of the files to set up a local working version of the 6 games are in this repository except the images. The images need to be in a separate directory called stringsThumbs, at the same directory level as the games and common (in this version, the top level of the server). If you intend to set this up to run locally, you have to get the images separately from IdeateGames (ideategames@gmail.com). The images I use are for non-commercial use only.

To set up a local version:

Clone this repository into a local directory. Then, you will need to either edit each index.html file to include all the .js files in each game directory and the /common directory or build the <game>_net.js file and common_net.js file. The scripts used to build those _net.js files are in /helpers: make_net.sh or make_common_net.sh. Correct the directory pointers in those files. These scripts use uglifyjs.

The games are configured to send usage data back to the Ideate Games database. This is optional (the games work without), and I have left this code out of the repository, but put in a dummy file to substitute.

Install or run a web server pointing to the top directory of this repository. Any web server should work.

Set your browser to point to one of the games. All the games have similar URLs and use index.html as the start file. If you used the simple web server, they will be:

http://localhost/Strings
http://localhost/Squares
http://localhost/Stacks
http://localhost/Doors
http://localhost/Paths

All content for the games are contained in the events table of js files located in /common. These files are built from csv files. The csv files are created/formatted by a python script (make_events_js.py in the helpers folder) that takes a csv raw file export from a spreadsheet. The resulting csv file can be loaded directly into the database with the load application. 

Content in raw form is created and maintained in Google spreadsheets, one spreadsheet per topic. Each of these has 10 fields. The filename ('image' field) for each entry is a unique key used for uniquely identifying each record. The filename must be unique across all content (all images are stored in the same directory, unsorted) and must not change once loaded (unless the old entry is purged). File names are typically the filetype as downloaded, although all images are converted into .png files for the games.

Image files are converted to .png files and two sizes, width=200 and width<=600. The larger images are then used for the filmstrip viewer and to source the circular images used in the games. I use ThumbsUp to create the larger size, then use GIMP to create the circular images, with the script crop_circles.py in the /helpers directory.
