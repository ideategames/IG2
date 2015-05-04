#!/usr/bin/python
#
# make circle images
#
from gimpfu import *
import glob

# change this directory to match where the images are
# then be sure to restart GIMP
# Usually, this is modified to have the topic as a subdirectory for new images
imgdir = '/home/.../Downloads/NewImages/'

def makeCircle(img):
    interlacing = 1
    compression = 1
    bg = 0
    fdir = imgdir
    fname = 'circular_image.png'
    if 'Users' in img:
        tmp = img.rfind('/')
        tmp2 = img.rfind('.')
        fname = img[tmp+1:tmp2]
        fdir = img[:tmp+1]
        image = pdb.file_png_load(img,img)
    else:
        image = img
        fname = 'circular_image.png'
    if image.width > image.height:
        wid = image.width * 154/image.height
        hgt = 154
    else:
        hgt = image.height * 154/image.width
        wid = 154

    # first, resize to 600 width
    #
    pdb.gimp_image_scale(image, 600, image.height * 600/image.width)
    pdb.file_png_save(image,image.active_drawable,fdir+'large/'+fname+'.png',
        fdir+'large/'+fname+'.png',interlacing, compression, bg, 0, 0, 1, 1)
    pdb.gimp_image_scale(image, wid, hgt)
    xloc = image.width/2 - 75
    yloc = image.height/2 - 75
    if image.width>image.height:
        siz = image.height - 2
    else:
        siz = image.width - 2
    pdb.gimp_image_select_ellipse(image,2,xloc,yloc,siz,siz)
    dummy = pdb.gimp_edit_copy(image.active_drawable)
    image2 = pdb.gimp_edit_paste_as_new()
    pdb.file_png_save(image2,image2.active_drawable,fdir+'circular/'+fname+'.png',
        fdir+'circular/'+fname+'.png',interlacing, compression, bg, 0, 0, 1, 1)

def makeCircleDir():
    # if not fdir:
    fdir = imgdir
    if (fdir[-1] != '/'):
        fdir = fdir + '/'
    for fn in glob.glob(fdir+'*'):
        tfn = fn[fn.rfind('.')+1:]
        if (tfn.lower() == "png" or tfn == "jpg" or tfn == "jpeg" or tfn == "gif"):
            makeCircle(fn)

register(
    "circle_cutout_image",
    "Extract a circle from the center of the image",
    "",
    "David Marques", "Ideate Games",
    "2015",
    "Filters/Web/Circle Extractor",
    "*",
    [],
    [],
    makeCircle)

register(
    "circle_cutout_dir",
    "Extract a circle from the center of the image",
    "",
    "David Marques", "Ideate Games",
    "2015",
    "Filters/Web/Circle Directory",
    "*",
    [],
    [],
    makeCircleDir)

main()
