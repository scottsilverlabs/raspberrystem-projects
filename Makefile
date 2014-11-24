#
# Requires:
#	- go (golang.org) (required on host to build/run, required on target to run)
#		- To add Go support on the Pi, in Raspbian:
#			sudo apt-get install golang
#	- Mercurial (hg) required by "go get":
#		- http://mercurial.selenic.com/wiki/Download, for Mac:
#			sudo port install mercurial
#	- Rebuild in linux/arm support for cross-compiling to the Pi.  On the Mac, this works:
#		cd /usr/local/go/src
#		sudo GOOS=linux GOARCH=arm ./make.bash
#		
PI=pi@raspberrypi
RUNONPI=ssh $(SSHFLAGS) -q -t $(PI) "cd rsinstall;"

VERSION:=$(shell git describe --tags --dirty)

# Final targets
IM_PDF:=$(OUT)/RaspberrySTEM_Instructor_Manual-$(RSTEM_VER).pdf
SP_PDF:=$(OUT)/RaspberrySTEM_Supplementary_Projects-$(RSTEM_VER).pdf
UG_PDF:=$(OUT)/RaspberrySTEM_User_Guide-$(RSTEM_VER).pdf

TARGETS=
TARGETS+=$(IM_PDF)
TARGETS+=$(SP_PDF)
TARGETS+=$(UG_PDF)

all: $(TARGETS)

targets:
	@echo $(TARGETS)

clean:
	rm -f $(TARGETS)

install:
	@echo "TBD"
