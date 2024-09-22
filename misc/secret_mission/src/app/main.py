from random import randint
import time

print("Welcome, Agent! Your mission is to crack the secret code to prevent a nuclear meltdown.")

max_attempts = 330
max_time = 60 

ans = randint(0, pow(10, 100))

start_time = int(time.time())
turns = 0

# Game loop
while True:
    turns += 1

    if int(time.time()) > start_time + max_time:
        print("Time's up, Agent! The meltdown cannot be stopped now!")
        break

    if turns > max_attempts:
        print("Too many failed attempts, Agent. The meltdown is inevitable now.")
        break

    inp = input("Enter your code guess: ")

    if "quit" in inp.lower():
        print("Mission aborted. You chose to retreat, Agent.")
        break

    if not inp.isdigit():
        print("Invalid input, Agent. We need a numerical code.")
        continue

    inp = int(inp)
    if inp > ans:
        if inp - ans > pow(10, 50):
            print("Your guess is way too high, Agent! Are you even trying?")
        else:
            print("Your guess is too high, Agent. Try a lower number.")
    elif inp < ans:
        if ans - inp > pow(10, 50):
            print("Your guess is way too low, Agent! Are you paying attention?")
        else:
            print("Your guess is too low, Agent. Try a higher number.")
    else:
        print("Congratulations, Agent! You've cracked the code and saved the world!")
        with open("flag.txt", "r") as f:
            print(f.read())
        break
