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

BUILDDIR=projects.build
PROJECTSDIR=im

# Final targets
PRJ_TAR:=$(abspath $(NAME)-$(VER).tar.gz)

TARGETS=
TARGETS+=$(PRJ_TAR)

# Default target
all: $(TARGETS)

#########################################################################
# Targets
#

pushpg:
	ssh swolski@raspberrystem.com mkdir -p raspberrystem.com/projectsguide
	scp -r im/* swolski@raspberrystem.com:raspberrystem.com/projectsguide
	@echo "####################################################################"
	@echo "### NOTE: you may want to also 'make pushpg' from raspberrystem-ide"
	@echo "####################################################################"

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
	rm -rf dist
	rm -f $(TARGETS)
	rm -rf $(BUILDDIR)

.PHONY: $(BUILDDIR)
$(BUILDDIR):
	@if [ -z "$(FORCE)" -a `git clean -n $(PROJECTSDIR) | wc -l` -gt 0 ]; then \
		echo "Refusing to build.  The $(PROJECTSDIR) directory is not git clean"; \
		echo "To force: make FORCE=1"; \
		exit 1; \
	fi
	@#
	@# Weirdo race condition.  Sometimes this rm fails with "Directory not
	@# empty".  The file in there is a Mac .DS_Store.  So we retry if it fails.
	@#
	if ! rm -rf $@; then \
		sleep 1 ; \
		rm -rf $@ ; \
	fi
	mkdir -p $@
	cp -r $(PROJECTSDIR)/* $@

$(PRJ_TAR): $(BUILDDIR) Makefile
	$(SETUP) sdist
	mv dist/$(notdir $@) $@
