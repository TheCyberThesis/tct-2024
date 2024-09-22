#include <stdio.h>
#include <string.h>

#define HEX_ENCRYPTED_FLAG "1e091e312779277a38331527797b3e7f15277b7f3879277927287938792e15277a2779243e7f37"  // Example hex encrypted flag
#define KEY 74  // Key used for XOR encryption

void hex_to_bytes(const char *hex, char *bytes) {
    size_t len = strlen(hex);
    for (size_t i = 0; i < len; i += 2) {
        sscanf(hex + i, "%2hhx", &bytes[i / 2]);
    }
}

void xor_encrypt_decrypt(char *data, int length, char key) {
    for (int i = 0; i < length; i++) {
        data[i] ^= key;
    }
}

void check_flag(const char *user_input) {
    // Convert hex encrypted flag to bytes
    char encrypted_flag[256];
    hex_to_bytes(HEX_ENCRYPTED_FLAG, encrypted_flag);
    size_t flag_length = strlen(HEX_ENCRYPTED_FLAG) / 2;

    // Decrypt the flag
    xor_encrypt_decrypt(encrypted_flag, flag_length, KEY);

    // Null-terminate the decrypted flag
    encrypted_flag[flag_length] = '\0';
	
    // Compare the user input with the decrypted flag
    if (strcmp(user_input, encrypted_flag) == 0) {
        printf("Congratulations! You have the correct flag.\n");
    } else {
        printf("Incorrect flag. Please try again.\n");
    }
}

int main() {
    char user_input[256]; // Buffer to hold user input

    // Prompt the user to enter the flag
    printf("Enter the flag: ");
    fgets(user_input, sizeof(user_input), stdin);

    // Remove newline character from fgets if present
    user_input[strcspn(user_input, "\n")] = '\0';

    // Check the flag
    check_flag(user_input);

    return 0;
}
