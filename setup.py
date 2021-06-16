# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in shs/__init__.py
from shs import __version__ as version

setup(
	name='shs',
	version=version,
	description='custom changes erp',
	author='Jyoti',
	author_email='jyoti@meritsystems.com',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
