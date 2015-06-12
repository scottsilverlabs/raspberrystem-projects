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
PYTHON=python3
SETUP=$(PYTHON) setup.py
PIP=pip-3.2

PI=pi@raspberrypi
RUNONPI=ssh $(SSHFLAGS) -q -t $(PI) "cd rsinstall;"

# Create version name
DUMMY:=$(shell scripts/version.sh)

# Name must be generated the same way as setup.py
NAME:=$(shell cat NAME)
VER:=$(shell cat VERSION)

PRJ_INDEX_HTML=RaspberrySTEM_Instructor_Manual.html
CREATE_PROJECTS=python3 $(abspath scripts/create_lesson_plans.py)

BUILDDIR=projects.build

# Final targets
PRJ_TAR:=$(abspath $(NAME)-$(VER).tar.gz)

TARGETS=
TARGETS+=$(PRJ_TAR)

# Default target
all: $(TARGETS)

#########################################################################
# Targets
#

upload:
	$(SETUP) sdist upload

register:
	$(SETUP) register

targets:
	@echo $(TARGETS)

uninstall:
	$(RUNONPI) sudo $(PIP) uninstall -y $(NAME)

install:
	scp $(PRJ_TAR) $(PI):/tmp
	-$(RUNONPI) sudo $(PIP) uninstall -y $(NAME)
	$(RUNONPI) sudo $(PIP) install /tmp/$(notdir $(PRJ_TAR))

clean:
	rm NAME VERSION
	rm -f *.tar.gz
	rm -rf *.egg-info
	rm -rf __pycache__
	rm -f $(TARGETS)
	rm -rf out
	rm -rf $(BUILDDIR)

tidy:
	tidy -im im/$(PRJ_INDEX_HTML)

$(BUILDDIR): $(shell git ls-files im)
	rm -rf $(BUILDDIR)
	@for f in $^; do \
		SRC=$$f ; \
		DEST=$(BUILDDIR)/`cut -f 2- -d / <<< $$f`; \
		mkdir -p `dirname $$DEST`; \
		cp -v $$SRC $$DEST ; \
	done
	#echo "div.lesson_discussion { display: none; }" > $(BUILDDIR)/override.css
	cd $(BUILDDIR) && $(CREATE_PROJECTS) $(PRJ_INDEX_HTML)
	rm $(BUILDDIR)/$(PRJ_INDEX_HTML)

$(PRJ_TAR): $(BUILDDIR) $(shell find $(BUILDDIR) 2>/dev/null) Makefile
	$(SETUP) sdist
	mv dist/$(notdir $@) $@
