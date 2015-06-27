#!/usr/local/bin/python3
from bs4 import BeautifulSoup
import os
import platform
import sys

if platform.system() == "Darwin":
    inkscape = "/Applications/Inkscape.app/Contents/Resources/bin/inkscape"

#
# Determine input/out file names
#
if len(sys.argv) != 2:
    print("Exactly one arg required - the name of the svg file")
    sys.exit()
filebase, ext = os.path.splitext(sys.argv[1])
if ext != ".svg":
    print("File must have .svg extension")
    sys.exit()
input_file = "'" + filebase + ext + "'"
intermediate_svg_file = "/tmp/new.svg"
output_file = "'" + filebase + ".png" + "'"

intermediate_svg_file = "new.svg"
soup = BeautifulSoup(open(filebase + ext))

#
# Remove all pin numbers.  Pin numbers are text elements that have a parent id
# attribute "schematic"
#
for tag in soup.find_all("text"):
    parent_ids = [p["id"] for p in tag.parents if "id" in p.attrs]
    if parent_ids and parent_ids[0] == "schematic":
        tag.string = ""

#
# Set all lines to black.  Lines that are 0.7 width should really be 0.75
#
for tag in soup.find_all("line"):
    tag["stroke"] = "#000000"
    width = float(tag["stroke-width"])
    if abs(0.7 - width) < 0.01:
        tag["stroke-width"] = "0.75"
        
#
# Set all paths to black
#
for tag in soup.find_all("path"):
    tag["stroke"] = "#000000"

with open(intermediate_svg_file, "w") as f:
    f.write(soup.prettify())

cmd = inkscape + " -z -e " + output_file + " -D -d 1200 " + intermediate_svg_file
os.system(cmd)
