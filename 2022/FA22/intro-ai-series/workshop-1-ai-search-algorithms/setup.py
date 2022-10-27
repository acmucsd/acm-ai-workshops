import os

from setuptools import setup


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="workshop1",
    version="0.0.1",
    author="ACM AI at UCSD",
    description="",
    license="MIT",
    keywords=["reinforcement-learning", "machine-learning", "ai"],
    packages=["src"],
    long_description=read("README.md"),
)
