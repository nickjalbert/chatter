#!/usr/local/bin/python

import random
import sys
import cgi
import re
import time
import pickle

def printDict(dict):
    print str(dict).replace("'", '"')

def printHTMLHeader():
    print "Content-type: text/html\n\n"

def hooliganShit(chat_log):
    print 

def main():
    #printDict([{"a":"b", "c":"d"}, {"e":"f", "g":"h"}])
    #sys.exit()
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

    if (words != "" and name != ""):
        chat_log.append({"name":name, "words":words})

    chat_log = chat_log[-20:]


    pickle.dump(chat_log, open("chat.log", "w"))
    printHTMLHeader()
    printDict(chat_log)



    return

main()

