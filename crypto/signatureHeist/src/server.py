import socket
import time
from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
import base64

correct_signature_b64 = "i3PYx45AB1qz8LpF90359jS3m6ProtJZ1ZGmdgyIPn3LsI6BbL9dXptRFgS4+4v9dCfmGG1LaSdvht0SafrHgy/UGzIYjEwimgbR1343SK0mT9ItkTNcBMHoAAvV7w1TuBtZA9hh0ke8mWnGGXgYa1J1t4voQl8xKL7hbPrUo+s="
flag = "TCT{u_13v3l3d_UP_70_4_Pr0f3550R!!!}"

def loadPublicKey(filepath):
    with open(filepath, 'rb') as f:
        return RSA.import_key(f.read())

def verifySignature(message, signature_b64, public_key):
    try:
        signature = base64.b64decode(signature_b64)
        h = SHA256.new(message)
        pkcs1_15.new(public_key).verify(h, signature)
        return True
    except (ValueError, TypeError):
        return False

def displayMessage(success, conn):
    if success:
        conn.sendall("\n\t\t\t\tCongratulations, mastermind!\n".encode())
        time.sleep(0.5)
        conn.sendall("You’ve cracked the code and secured the loot. The heist was a success.\n".encode())
        time.sleep(0.5)
        conn.sendall("Here’s your reward:\n".encode())
        time.sleep(0.5)
        conn.sendall(f"\n\t\t\t\t{flag}\n\n".encode())
    else:
        conn.sendall("\n\t\t\t\tAlert! The heist has been compromised!\n".encode())
        time.sleep(0.5)
        conn.sendall("Your signature didn’t match. The authorities are closing in.\n".encode())
        time.sleep(0.5)
        conn.sendall("You’ve failed the mission.\n".encode())
        time.sleep(0.5)
        for word in ["\n\t\t\t\t", "Better ", "luck ", "next ", "time."]:
            conn.sendall(word.encode())
            time.sleep(0.5)

def Intro(conn):
    introLines = [
        "\n\t\t\t\tWelcome to the Signature Heist Challenge.",
        "\nListen to me. The second any blood is shed, we lose.",
        "\nAnd the plan is very simple. We start with the most basic rule: never tell anyone your plan.",
        "\nAnd keep your head cool. Because if you lose your head, it's over.",
        "\nTime is ticking, and the stakes couldn't be higher.",
        "\nThis is your moment to shine, but remember: one mistake, and the whole thing unravels.",
        "\nStay sharp. The clock is running."
    ]
    for line in introLines:
        conn.sendall(line.encode())
        time.sleep(1)
    
    for word in ["\n\t\t\t\t", "Prepare ", "yourself. ", "Your ", "challenge ", "starts ", "now. "]:
        conn.sendall(word.encode())
        time.sleep(0.5)
    
    conn.sendall(("\n" + "-" * 140 + "\n").encode())

def handle_client(conn):
    try:
        Intro(conn)
        
        public_key_path = 'public_key_hard1.pem'
        public_key = loadPublicKey(public_key_path)

        message = b"Let's the chaos begin."
        conn.sendall("\nEnter the signature: ".encode())
        user_signature_b64 = conn.recv(1024).decode().strip()

        success = verifySignature(message, user_signature_b64, public_key)
        displayMessage(success, conn)
    except Exception as e:
        conn.sendall(f"Error: {str(e)}".encode())
    finally:
        conn.close()

def main():
    HOST = '0.0.0.0'
    PORT = 5000

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print(f'Server listening on port {PORT}...')
        while True:
            conn, addr = s.accept()
            print(f'Connected by {addr}')
            handle_client(conn)

if __name__ == '__main__':
    main()
