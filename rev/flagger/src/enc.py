def xor_encrypt_decrypt(input_string, key):
    return ''.join(chr(ord(c) ^ key) for c in input_string)

def to_hex_string(input_string):
    return ''.join(f'{ord(c):02x}' for c in input_string)

# Define the flag and key
flag = "TCT{m3m0ry_m31t5_m15r3m3mb3r3d_m0m3nt5}"
key = 74  # Example key for XOR encryption

# Encrypt the flag
encrypted_flag = xor_encrypt_decrypt(flag, key)
hex_encrypted_flag = to_hex_string(encrypted_flag)
print("Hex Encrypted Flag:", hex_encrypted_flag)

# Save hex_encrypted_flag value and key for use in C code
