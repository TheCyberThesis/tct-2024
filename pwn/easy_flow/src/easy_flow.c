#include <stdio.h>
#include <stdlib.h>
#include <string.h>

__attribute__((constructor))
void __constructor__(){
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
    alarm(0x10);
    // setuid(0);
    // setgid(0);
}

void read_flag() {
    char flag[64];
    FILE *file = fopen("flag.txt", "r");
    if (file == NULL) {
        printf("Could not open flag.txt\n");
        exit(1);
    }
    fgets(flag, sizeof(flag), file);
    printf("Flag: %s\n", flag);
    fclose(file);
}

void vulnerable_function() {
    char buffer[1337];
    printf("Enter what you think is the good amount: ");
    fgets(buffer, sizeof(buffer) + 16, stdin);
    if (strlen(buffer) > sizeof(buffer)) {
        printf("Succesfully executed buffer overflow wohooooooooooooooooo\n");
        printf("Here's you flag: ");
        read_flag();
    } else {
        printf("Input received: %s\n", buffer);
    }
}

int main() {
    vulnerable_function();
    printf("Happy Hacking!!!!!!\n");
    return 0;
}
