#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>


#define MAX_RESPONSES 5
#define MAX_INPUT 256
#define MAX_RESPONSE 512
#define MAX_PASS 16

__attribute__((constructor))
void __constructor__(){
    setbuf(stdin, NULL);
    setbuf(stdout, NULL);
    setbuf(stderr, NULL);
    alarm(0x10);
    // setuid(0);
    // setgid(0);
}

typedef struct {
    char *patterns[MAX_RESPONSES];
    char *responses[MAX_RESPONSES];
    int pattern_count;
    int response_count;
} ResponsePattern;

void generate_response(char *input, char *response);
void add_response_pattern(ResponsePattern *rp, char *pattern, char *response);
void initialize_response_patterns();
void select_random_response(ResponsePattern *rp, char *response);
int match_pattern(char *input, char *pattern);
void admin_portal();
void check_password();

ResponsePattern response_patterns[MAX_RESPONSES];
int response_pattern_count = 0;

int main() {

    char input[MAX_INPUT];
    char response[MAX_RESPONSE];

    srand(time(NULL));

    printf("Chatbot: Hi! I'm a more complex C chatbot. How can I help you today?\n");

    initialize_response_patterns();

    while (1) {
        printf("You: ");
        fgets(input, sizeof(input), stdin);
        input[strcspn(input, "\n")] = '\0';

        if (strcmp(input, "root") == 0) {
            check_password();
        } else {
            generate_response(input, response);
            printf("Chatbot: %s\n", response);
        }
    }

    return 0;
}

void generate_response(char *input, char *response) {
    for (int i = 0; i < response_pattern_count; i++) {
        for (int j = 0; j < response_patterns[i].pattern_count; j++) {
            if (match_pattern(input, response_patterns[i].patterns[j])) {
                select_random_response(&response_patterns[i], response);
                return;
            }
        }
    }
    snprintf(response, sizeof(response), "I'm not sure how to respond to that.");
}

void add_response_pattern(ResponsePattern *rp, char *pattern, char *response) {
    if (rp->pattern_count < MAX_RESPONSES) {
        rp->patterns[rp->pattern_count++] = pattern;
    }
    if (rp->response_count < MAX_RESPONSES) {
        rp->responses[rp->response_count++] = response;
    }
}

void initialize_response_patterns() {
    ResponsePattern greeting;
    greeting.pattern_count = 0;
    greeting.response_count = 0;
    add_response_pattern(&greeting, "hello", "Hello! How can I assist you?");
    add_response_pattern(&greeting, "hi", "Hi there! What can I do for you?");
    response_patterns[response_pattern_count++] = greeting;

    ResponsePattern how_are_you;
    how_are_you.pattern_count = 0;
    how_are_you.response_count = 0;
    add_response_pattern(&how_are_you, "how are you", "I'm just a bunch of code, but I'm here to help!");
    add_response_pattern(&how_are_you, "how's it going", "I'm here to assist you with anything you need.");
    response_patterns[response_pattern_count++] = how_are_you;

    ResponsePattern name;
    name.pattern_count = 0;
    name.response_count = 0;
    add_response_pattern(&name, "what is your name", "I'm a simple C chatbot.");
    add_response_pattern(&name, "who are you", "I'm a chatbot written in C to assist you.");
    response_patterns[response_pattern_count++] = name;
}

void select_random_response(ResponsePattern *rp, char *response) {
    int index = rand() % rp->response_count;
    snprintf(response, sizeof(response), "%s", rp->responses[index]); 
}

int match_pattern(char *input, char *pattern) {
    return strstr(input, pattern) != NULL;
}

void admin_portal() {
    char admin_input[MAX_INPUT];
    printf("Admin Portal: You can alter responses or add patterns here.\n");

    while (1) {
        printf("Admin: ");
        fgets(admin_input, sizeof(admin_input), stdin);
        admin_input[strcspn(admin_input, "\n")] = '\0';

        if (strcmp(admin_input, "exit") == 0) {
            break;
        }

        char pattern[MAX_INPUT];
        char response[MAX_INPUT];

        printf("Enter pattern: ");
        fgets(pattern, sizeof(pattern), stdin);
        pattern[strcspn(pattern, "\n")] = '\0';

        printf("Enter response: ");
        fgets(response, sizeof(response), stdin);
        response[strcspn(response, "\n")] = '\0';


        printf("Pattern and response added.\n");
    }
}
void imp(void *address) {
    __asm__ volatile (
        "mov %0, %%rdi\n\t"  
        "pop %%rdi\n\t"    
        "ret\n\t"           
        :                    
        : "r"(address)       
        : "%rdi"             
    );
}

void check_password() {
    char correct_pass[MAX_PASS] = "root"; 
    char user_pass[101]; 

    printf("If you are admin then enter pass: ");
    gets(user_pass); 

    if (strcmp(correct_pass, user_pass) == 0) {
        admin_portal(); 
    } else {
        printf("Access denied.\n");
    }
}
