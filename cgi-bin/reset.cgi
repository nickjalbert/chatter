#!/usr/local/bin/python

#Author: Nick Jalbert (nickjalbert@gmail.com)

import random
import sys
import os
import cgi
import re
import time
import pickle

def getHTMLHeader():
    return "Content-type: text/html\n\n"

def main():
    if os.path.exists("seq.log"):
        os.remove("seq.log")
    if os.path.exists("chat.log"):
        os.remove("chat.log")

    print getHTMLHeader()



main()
