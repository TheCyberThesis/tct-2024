def encrypt_decrypt(data, key):
    return ''.join(chr(ord(char) ^ key) for char in data)

password = "TCT{8y73_8y_8y73_l0l}"
key = 0x74

# Encrypt the password
encrypted_password = encrypt_decrypt(password, key)

# Print the encrypted password as a list of hexadecimal values
encrypted_hex = [hex(ord(char)) for char in encrypted_password]
print("Encrypted password:", encrypted_hex)
