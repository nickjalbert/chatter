#!/usr/local/bin/python

#Author: Nick Jalbert (nickjalbert@gmail.com)

import random
import sys
import os
import cgi
import re
import time
import pickle


def setupEnvironment():
    if not os.path.exists("chat.log"):
        pickle.dump([], open("chat.log", "w"))
    if not os.path.exists("seq.log"):
        d = {}
        d["curr"] = 0
        d["max"] = 25
        pickle.dump(d, open("seq.log", "w"))

def getJSONDict(dict):
    return str(dict).replace("'", '"')

def getHTMLHeader():
    return "Content-type: text/html\n\n"

def main():
    setupEnvironment()
    form = cgi.FieldStorage()
    try:
        name = form["name"].value
    except:
        name = ""
    try:
        words = form["words"].value
    except:
        words = ""
    chat_log = pickle.load(open("chat.log", "r"))
    seq = pickle.load(open("seq.log", "r"))


    if (words != "" and name != ""):
        seq["curr"] += 1
        if seq["curr"] == seq["max"]:
            seq["curr"] = 0
        d = {"name":name, "words":words, "seq":seq["curr"], "max":seq["max"]}
        chat_log.append(d)

    chat_log = chat_log[-20:]

    pickle.dump(chat_log, open("chat.log", "w"))
    pickle.dump(seq, open("seq.log", "w"))
    print getHTMLHeader()
    print getJSONDict(chat_log)


main()
