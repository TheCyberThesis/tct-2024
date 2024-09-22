#include <stdio.h>
#include <string.h>

#define PASSWORD_LENGTH 21
#define KEY 0x74

int check_password(const char *input) {
    // Encrypted password stored on the stack
    char encrypted_password[PASSWORD_LENGTH + 1] = {
        0x20, 0x37, 0x20, 0x0f, 0x4c, 0x0d, 0x43, 0x47, 0x2b, 0x4c,
        0x0d, 0x2b, 0x4c, 0x0d, 0x43, 0x47, 0x2b, 0x18, 0x44, 0x18, 0x09
    };

    // Flag to track if all characters match
    int match = 1;

    // Decrypt the password and compare it with the input simultaneously
    for (int i = 0; i < PASSWORD_LENGTH; i++) {
        if (input[i] != (encrypted_password[i]^ KEY)) {
            match = 0; // Passwords don't match
        }
    }

    return match;
}

int main() {
    char user_input[PASSWORD_LENGTH + 1]; // +1 for the null terminator

    printf("Enter password: ");
    fgets(user_input, sizeof(user_input), stdin);

    // Remove the newline character if present
    user_input[strcspn(user_input, "\n")] = 0;

    if (check_password(user_input)) {
        printf("Access granted.\n");
    } else {
        printf("Access denied.\n");
    }

    return 0;
}
