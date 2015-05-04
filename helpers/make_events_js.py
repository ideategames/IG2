#!/usr/bin/python

import csv
import sys

saves = {}
locs = []
idxs = []
images = []

def convertDataFile(ifile,aut):
    numE = 0
    topic = ""
    if not aut:
        aut = "DMM"
    for tmp in ifile:
        if tmp[0].strip().lower() != "description" and tmp[0] != "" and tmp[8] != "" and tmp[0][0] != ";":
            if (len(tmp[2])>2):
                topic = tmp[2]
            if (numE==0):
                ### need to modify this directory to where your /common directory sits
                of = open("/home/www-data/common/js/" + tmp[2] + "_data.js","w")
                outf = of
                of.write("EventVars['"+tmp[2]+"'] = [")
            numE+=1
#            tline = line.strip().replace('"','')
#            tmp = tline.split("\t")
#            saves['"'  + tmp[0] + '"'] = tline.strip("\t" ).lower()
            if tmp[8] not in idxs:
                idxs.append(tmp[8])
            else:
                print("key duplicate: "+tmp[8])
            saves['"'  + tmp[0] + '"'] = (str(tmp) + aut).strip('[],').lower()
            eventh = hash(tmp[0])

            if outf:
                tmpfile = tmp[8].replace(' ','_').replace('.jpg','.png').replace('.jpeg','.png').replace('.gif','.png').replace('.JPG','.png').replace(',','_')

                # input is descr, objects, topic, location, date, actor, category, source, image, URL
                outf.write('{description: "'+tmp[0].replace('"',"'").strip()+'", '+
                    'objects: "'+tmp[1].replace('\n',' ').replace('"',"'")+'", '+
                    'location: "'+tmp[3].replace('"',"'").strip()+'", '+
                    'date: "'+tmp[4].replace('"',"'").strip()+'", '+
                    'actor: "'+tmp[5].replace('"',"'").strip()+'", '+
                    'category: "'+tmp[6].replace('"',"'").strip()+'", '+
                    'image: "'+tmpfile+'", '+
                    'topic: "'+topic+'", '+
                    'URL: "'+tmp[9].replace('"',"'").strip()+'"},\n')
    of.write("]\n")
    of.write("EventNum = "+str(numE))
    of.close()
    return numE
### end of function

appname = sys.argv[1].replace(" ","_")

numEvents = 0
### need to modify these directories to wherever you have your 
### data files
for inum in range(1,2):
    try:
        inf = open("/home/.../Downloads/" + appname + " - Sheet1.csv","U")
    except:
        inf = open("/home/.../Downloads/" + appname + " - Sheet 1.csv","U")
    reader = csv.reader(inf)
    numEvents = numEvents + convertDataFile(reader,"DMM")
    print("#events: "+str(numEvents))
    inf.close()
    # except:
    #     print("no file for: "+str(inum))

