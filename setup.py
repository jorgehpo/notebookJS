from setuptools import setup, find_packages

with open("README.md", "r") as fh:
    long_description = fh.read()

setup(
    name="notebookjs",
    version="0.1.4",
    author="Jorge Piazentin Ono, Juliana Freire, Claudio Silva",
    author_email="jorgehpo@nyu.edu",
    description="notebookJS library - Seamless JavaScript integration in Python Notebooks",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/jorgehpo/notebookJS",
    packages=find_packages(exclude=['resources']),
    include_package_data=True,
    license="MIT",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
    install_requires=[
        "notebook"
    ]
)
