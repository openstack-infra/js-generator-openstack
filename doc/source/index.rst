==========================
OpenStack Yeoman Generator
==========================

Welcome to the documentation for the OpenStack Yeoman Project Generator. This project
allows you to create a new OpenStack JavaScript project, and update an existing project
with new settings, dependencies, and tools.

Quickstart
==========

If you'd just like to create a new project, you can do so quickly and easily with the following
steps:

.. code:: bash

   npm install -g yo generator-openstack

   cd my_project_directory

   yo openstack

From here, you'll be asked a few basic questions about your new project, and once completed, your
project will be ready to go!

Contributing
============

There are several quick and easy ways that you can contribute to this project:

1. File Bugs on StoryBoard_.
2. Chat on IRC in `#openstack-javascript`_.
3. Review code on gerrit_.

If you'd like to contribute code, and for more information on project tooling, conventions, and
setup, please see our :doc:`./development_guide`.

Topics
======

.. toctree::
     :maxdepth: 2

     development_guide
     specs

.. _StoryBoard: https://storyboard.openstack.org/#!/project/842
.. _gerrit: https://review.openstack.org/#/q/status:open+AND+project:openstack/js-generator-openstack,n,z
.. _#openstack-javascript: http://webchat.freenode.net/?channels=openstack-javascript
.. _Community Code of Conduct: https://www.openstack.org/legal/community-code-of-conduct/
