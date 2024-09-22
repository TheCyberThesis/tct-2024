from flask import Flask, render_template, request, jsonify
import hashlib
import json
import os

app = Flask(__name__)

TARGET_SALT = '5f06ac9dacd3e4169912887a921a49c4'

@app.route('/')
def index():
    blockchain = load_blockchain_from_file('blockchain.json')
    return render_template('index.html', blockchain=blockchain)

@app.route('/load_blockchain', methods=['POST'])
def load_blockchain():
    file_path = request.form['file_path']
    if file_path and os.path.exists(file_path):
        blockchain = load_blockchain_from_file(file_path)
        return jsonify({'success': True, 'blockchain': blockchain})
    else:
        return jsonify({'success': False, 'error': 'File not found'})

@app.route('/save_blockchain', methods=['POST'])
def save_blockchain():
    blockchain = request.json.get('blockchain', [])
    file_path = request.form['file_path']
    with open(file_path, 'w') as f:
        json.dump(blockchain, f, indent=4)
    return jsonify({'success': True})

@app.route('/check_hash', methods=['POST'])
def check_hash():
    entered_hash = request.form['hash']
    blockchain = load_blockchain_from_file('blockchain.json')
    expected_hash = process_blocks(blockchain, TARGET_SALT)
    if entered_hash == expected_hash:
        return jsonify({'success': True, 'message': 'Vault Breached! Here is your flag: TCT{U_kN0w_h0w_70_d3CRy97_fU7Ur3!!!}'})
    else:
        return jsonify({'success': False, 'message': 'Invalid hash. Please try again.'})

def load_blockchain_from_file(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def compute_md5_hash(data):
    """Compute the MD5 hash of the given data."""
    return hashlib.md5(data.encode()).hexdigest()

def process_blocks(blockchain_data, target_salt):
    """Process blocks and compute a new MD5 hash."""
    hashes = []

    for block in blockchain_data:
        salt = block.get('salt')
        hash_value = block.get('hash')

        if salt == target_salt and hash_value:

            hashes.append(hash_value)

    if hashes:
        concatenated_hashes = ''.join(hashes)
        new_md5_hash = compute_md5_hash(concatenated_hashes)
        
        return new_md5_hash
    else:
        return None

if __name__ == "__main__":
    app.run(debug=True)
