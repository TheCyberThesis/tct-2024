#!/usr/bin/python -S

import re
import time
 
flag = open("flag.txt").read()

buff = input(">>> ")

BlACKLIST = ['print', 'help', '__globals__', '__locals__']

if any(keyword in buff for keyword in BlACKLIST):
    print("LOL!! Try Again")
else:
    try:
        if eval(buff) != 2004 or re.search(r'\d', buff):
            print("LOL!! Try Again")
        else:
            time.sleep(0.5)
            print("Oh, fantastic. Just what I needed from you. Enjoy!!!\n")
            time.sleep(0.5)
            print(flag)
            time.sleep(0.5)
    except Exception as e:
        print("LOL!! Try Again")
