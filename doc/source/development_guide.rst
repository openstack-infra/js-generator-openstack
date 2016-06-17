=================
Development Guide
=================

If you would like to contribute to the development of this project,
you must follow the steps on this page:

   http://docs.openstack.org/infra/manual/developers.html

If you already have a good understanding of how the system works and your
OpenStack accounts are set up, you can skip to the development workflow section
of this documentation to learn how changes to OpenStack should be submitted for
review via the Gerrit tool:

   http://docs.openstack.org/infra/manual/developers.html#development-workflow

Install Prerequisites
=====================

.. code:: bash

   # Instructions for Ubuntu

   sudo apt-get install nodejs nodejs-legacy npm git git-review pip

   pip install Sphinx oslosphinx

   npm install -g yo


Bootstrap the Project
=====================

.. code:: bash

   # Clone the repository.
   git clone git://git.openstack.org/openstack/js-generator-openstack
   cd js-generator-openstack

   # Install project dependencies
   npm install

   # Initialize Gerrit
   git review -s

This should set up your project directory and make it ready for development.

Useful Commands for Development
===============================

* ``npm link`` - Link this project into your global npm runtime. This allows you to run the project
  (via ``yo openstack``) as if it was installed via ``npm install -g``
* ``npm test`` - Run all the tests.
* ``npm run lint`` - Perform a linting check.
* ``npm run doc`` - Build this documentation (requires Sphinx and oslosphinx)
