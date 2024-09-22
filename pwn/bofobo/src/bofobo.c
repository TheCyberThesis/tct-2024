#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define BUF_SIZE 0x100
#define NUM_FORTUNES 5

const char* fortunes[NUM_FORTUNES] = {
    "You will have a great day!",
    "Be cautious of unexpected events.",
    "A surprise awaits you soon.",
    "Your hard work will pay off.",
    "Good news will come your way."
};

void read_user_input(char *buffer, int len)
{
    int n_bytes = fread(buffer, 1, len, stdin);
    buffer[n_bytes] = '\0';
}

void reveal_fortune()
{
    printf("Choose a number between 1 and %d to reveal your fortune: ", NUM_FORTUNES);
    char num_buf[5];
    fgets(num_buf, 5, stdin);
    int num = atoi(num_buf);
        srand(time(NULL)); 
    int index = rand() % NUM_FORTUNES; 
    printf("\n");
    printf("Here is your fortune: %s\n", fortunes[index]);
    char fmt_buf[100];
    snprintf(fmt_buf, 100, "But what the heck is this?!?!!? : %%%d$llx\n", num);
    printf(fmt_buf); 
       printf("\n");
}

void offer_random_fortune()
{
    srand(time(NULL));
    int index = rand() % NUM_FORTUNES;
    printf("A random fortune for you: %s\n", fortunes[index]);
}

__attribute__((noinline)) void
display_message(char *buffer, int num)
{
    read_user_input(buffer, num);
    printf("You shared:\n");
    printf("%s", buffer);
}

__attribute__((noinline)) void
process_message(int num)
{
    char buffer[BUF_SIZE];
    display_message(buffer, num);
}

__attribute__((noinline)) void
prompt_byte_count()
{
    printf("Can you please tell how long is your secret? ");
    char buffer[5];
    fgets(buffer, 5, stdin);
    int num = atoi(buffer);
    if (num < 0 || num > BUF_SIZE)
    {
        printf("Please follow the rules!\n");
        return;
    }
    process_message(num);
}

__attribute__((noinline)) void
start_fortune_telling()
{
    volatile char wat = 0;
    printf("Share your secrets here\n");
    prompt_byte_count();
    printf("Take care bye!!\n");
    offer_random_fortune();  // Additional function call
}

__attribute__((noinline)) void
wait_for_action()
{
    printf("Press enter to receive your fortune\n");
    getchar();
    reveal_fortune();
    start_fortune_telling();
}

int main()
{
    setbuf(stdout, NULL);
    printf("Welcome to the Fortune Teller\n");
    wait_for_action();
}
