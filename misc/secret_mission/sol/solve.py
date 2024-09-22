from pwn import *

io = remote(sys.argv[1], int(sys.argv[2])
    ) if args.REMOTE else process(['python3', 'main.py'])

def guessNum(code):
    io.sendlineafter("Enter your code guess: ", str(code).encode())
    sleep(0.3)
    io.recvline()
    response = io.recvline().decode('utf-8')
    if "Congratulations" in response:
        extra_response = io.recvline()
        print(f"Flag: {extra_response}")
    return response


def binarySearch():
    ATTEMPTS = 0
    low = 0
    high = pow(10, 100) - 1

    while low <= high:
        ATTEMPTS += 1
        mid = (low + high) // 2
        
        if (ATTEMPTS%80) == 0:
            print(f"Attempt No: {ATTEMPTS}")
            print("Trying: restart\n")
            io.sendlineafter("Enter your code guess: ", "restart".encode())
            continue
        else:
            print(f"Attempt No: {ATTEMPTS}")
            print(f"Trying: {mid}")
            
            response = guessNum(mid)
            print(response)

            
            if "Congratulations" in response:
                break
            elif "too high" in response:
                high = mid - 1
            elif "too low" in response:
                low = mid + 1
            else:
                print("Unexpected response received...")
                break

    io.close()

binarySearch()
