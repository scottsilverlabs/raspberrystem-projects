#!/usr/bin/env python3
#
# Copyright (c) 2014, Scott Silver Labs, LLC.
#
import os
from setuptools import setup, find_packages
from setuptools.command.install import install as _install

# Utility function to read the README file.
def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

outputs = ['/opt/raspberrystem/projects']

def _post_install(dir):
    from subprocess import call
    call('bash ./pkg/postinstall %s rstem' % dir, shell=True)

# Post installation task to setup raspberry pi
class install(_install):
    # Required to force PiP to know about our additional files.
    def get_outputs(self):
        return super().get_outputs() + outputs

    def run(self):
        super().run()
        self.execute(_post_install, (self.install_lib,), msg='Running post install task...')

setup(
    name = read('NAME').strip(),
    version = read('VERSION').strip(),
    author = 'Brian Silverman',
    author_email = 'bri@raspberrystem.com',
    description = ('RaspberrySTEM Project Guides'),
    keywords = ['raspberrystem', 'raspberrypi', 'stem', 'docs'],
    url = 'http://www.raspberrystem.com',
    long_description = read('README.md'),
    # use https://pypi.python.org/pypi?%3Aaction=list_classifiers as help when editing this
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Topic :: Education',
        'Topic :: Scientific/Engineering',
        'Topic :: Software Development :: Embedded Systems',
        'Programming Language :: Python :: 3.2',
        'Programming Language :: Python :: 3.3',
    ],
    cmdclass={'install': install},  # overload install command
)
