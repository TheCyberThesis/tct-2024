#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_PASSWORD_LENGTH 27
int rights = 0x6e6f6e65;
void admin() {
    printf("Admin privileges detected. Welcome, Administrator!\n");
    
    char buf[1024];
    char flag[64];

    printf("Is there anything left that you wanna say as closing remarks?\n");
    fflush(stdout);
    scanf("%1024s", buf);
    printf("This is what you said: "); // Print the entered remarks
    printf(buf);
    fflush(stdout);

    if (rights == 0x726f6f74) {
        printf("It seems you've bypassed our security measures. You must possess extraordinary skills.\n");
        printf("Here is the flag you requested:\n");

        // Read in the flag
        FILE *fd = fopen("flag.txt", "r");
            fgets(flag, sizeof(flag), fd);
            printf("%s", flag);
            fclose(fd);
    }
    else {
        printf("It appears you haven't yet met our expectations. You can strive to do better!\n");
    }
}
int pass_check() {
    char stored_password[MAX_PASSWORD_LENGTH + 1]; // +1 for null terminator
    char entered_password[MAX_PASSWORD_LENGTH + 1]; // +1 for null terminator

    // Open the file containing the stored password
    FILE *file = fopen("password.txt", "r");
    if (file == NULL) {
        printf("Error opening file!\n");
        return 1;
    }

    // Read the stored password from the file
    if (fgets(stored_password, sizeof(stored_password), file) == NULL) {
        printf("Error reading password from file!\n");
        fclose(file);
        return 1;
    }

    // Close the file
    fclose(file);

    // Remove trailing newline character from stored password
    stored_password[strcspn(stored_password, "\n")] = '\0';

    // Prompt the user for the password
    printf("Enter password: ");
    fflush(stdout); // Ensure prompt is displayed before input

    // Read the password directly using fgets
    if (fgets(entered_password, sizeof(entered_password), stdin) == NULL) {
        printf("Error reading password!\n");
        return 1;
    }

    // Remove trailing newline character from entered password
    entered_password[strcspn(entered_password, "\n")] = '\0';

    // Compare the entered password with the stored password
    if (strcmp(stored_password, entered_password) == 0) {
        printf("Password correct! Access granted.\n");
        return 0; // Indicate successful password check
    } else {
        printf("Incorrect password: %s\n");
        printf(entered_password);
        return 1; // Indicate failed password check
    }
}

int main() {
    if(pass_check() == 0) {
        admin();
    }
    return 0;
}
