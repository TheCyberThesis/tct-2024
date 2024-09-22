from flask import Flask, request, jsonify
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import os

app = Flask(_name_)

# Function to XOR the key with 0x55
def xor_key(key, xor_value):
    return bytes(b ^ xor_value for b in key)

# Example AES key and flag
KEY = os.urandom(16)  # 16 bytes AES key
FLAG = "TCT{X55_7hr0u9h_4ppl1c4710n_TCT_1s_g3771n9_0u774_h4nd555}"  # Replace with your actual flag

# Ensure the flag is in bytes
flag_bytes = FLAG.encode('utf-8')

# Pad the flag to be a multiple of AES block size (16 bytes)
padded_flag = pad(flag_bytes, AES.block_size)

# Initialize AES cipher in ECB mode
cipher = AES.new(KEY, AES.MODE_ECB)

# Encrypt the flag
encrypted_flag = cipher.encrypt(padded_flag)

# XOR the AES key with 0x55
XOR_VALUE = 0x55
xor_key_result = xor_key(KEY, XOR_VALUE)

# Encode the XORed key and encrypted flag in Base64
encoded_xor_key = base64.b64encode(xor_key_result).decode('utf-8')
encoded_encrypted_flag = base64.b64encode(encrypted_flag).decode('utf-8')

@app.route('/get_aes_flag', methods=['GET'])
def get_aes_flag():
    api_key = request.args.get('api_key')
    
    if api_key:
        # Directly compare the received API key
        if api_key == 'TCT{this_is_indeed_the_api_key_but_not_flag}':  # Replace with the actual decrypted key value
            # Return the encoded key and encrypted flag
            data = {
                'aes_key': encoded_xor_key,
                'encrypted_flag': encoded_encrypted_flag
            }
            return jsonify(data)
        else:
            return jsonify({'error': 'Invalid API key'}), 401
    else:
        return jsonify({'error': 'API key is missing'}), 400

if _name_ == '_main_':
    app.run(debug=True)