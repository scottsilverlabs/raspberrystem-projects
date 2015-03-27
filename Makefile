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
LP_INDEX_HTML=RaspberrySTEM_Instructor_Manual.html
CREATE_LESSON_PLANS=python3 $(abspath scripts/create_lesson_plans.py)

TGT_VAR_DIR=/var/local/raspberrystem/ide/
TGT_LESSONS_DIR=$(TGT_VAR_DIR)/website/lessons
OUT=$(abspath out)

# Final targets
LP_TAR:=$(OUT)/lesson_plans-$(VERSION).tar.gz
IM_PDF:=$(OUT)/RaspberrySTEM_Instructor_Manual-$(VERSION).pdf
SP_PDF:=$(OUT)/RaspberrySTEM_Supplementary_Projects-$(VERSION).pdf
UG_PDF:=$(OUT)/RaspberrySTEM_User_Guide-$(VERSION).pdf

TARGETS=
TARGETS+=$(LP_TAR)
#TARGETS+=$(IM_PDF)
#TARGETS+=$(SP_PDF)
#TARGETS+=$(UG_PDF)

all: $(TARGETS)

targets:
	@echo $(TARGETS)

clean:
	rm -f $(TARGETS)
	rm -rf out
	rm -rf build

install:
	scp $(LP_TAR) $(PI):/tmp
	$(RUNONPI) "cd $(TGT_LESSONS_DIR) && sudo tar xvf /tmp/$(notdir $(LP_TAR))"

tidy:
	tidy -im im/$(LP_INDEX_HTML)

$(OUT):
	mkdir -p $@

.PHONY: $(LP_TAR)
$(LP_TAR): $(shell git ls-files im) | $(OUT)
	rm -rf build/im
	@for f in $^; do \
		mkdir -p `dirname build/$$f`; \
		cp -v $$f build/$$f; \
	done
	echo "div.lesson_discussion { display: none; }" > build/im/override.css
	cd build/im && $(CREATE_LESSON_PLANS) $(LP_INDEX_HTML)
	rm build/im/$(LP_INDEX_HTML)
	cd build/im && tar cvzf $@ *
