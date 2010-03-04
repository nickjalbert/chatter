#!/usr/local/bin/python

#Author: Nick Jalbert (nickjalbert@gmail.com)

import random
import sys
import os
import cgi
import re
import time
import pickle

chat_history_size = 20

def storeChatLog(chat_log):
    pickle.dump(chat_log, open("chat.log", "w"))

def storeSeqLog(seq):
    pickle.dump(seq, open("seq.log", "w"))

def getChatLog():
    return pickle.load(open("chat.log", "r"))

def getSeqLog():
    return pickle.load(open("seq.log", "r"))

def getJSONDict(dict):
    return str(dict).replace("'", '"')

def getHTMLHeader():
    return "Content-type: text/html\n\n"

def setupEnvironment():
    if not os.path.exists("chat.log"):
        storeChatLog([])
    if not os.path.exists("seq.log"):
        d = {}
        d["curr"] = 0
        d["max"] = chat_history_size + 1
        storeSeqLog(d)

def updateSequenceInformation(seq):
    seq["curr"] += 1
    if seq["curr"] == seq["max"]:
        seq["curr"] = 0
    return seq

def getDBInfo():
    fin = open("../private/sql.info", "r").readlines()
    db_name = fin[0].split(":")[1].strip()
    db_user = fin[1].split(":")[1].strip()
    db_pw = fin[2].split(":")[1].strip()
    return db_name, db_user, db_pw


def processName(name):
    return "<b>" + str(name) + "</b>"

def processWords(words):
    return words

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
    chat_log = getChatLog()
    seq = getSeqLog()

    if (words != "" and name != ""):
        updated_seq = updateSequenceInformation(seq)
        saved_name = processName(name)
        saved_words = processWords(words)
        
        d = {}
        d["name"] = saved_name 
        d["words"] = saved_words
        d["seq"] = updated_seq["curr"]
        d["max"] = updated_seq["max"]
        
        chat_log.append(d)
        
        chat_log = chat_log[-1*chat_history_size:]
        storeChatLog(chat_log)
        storeSeqLog(updated_seq)
    
    print getHTMLHeader()
    print getJSONDict(chat_log)


main()
