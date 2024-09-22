FROM theflash2k/pwn-chal:latest

ENV SETUID_USER=root
ENV CHAL_NAME=rooty
ENV REDIRECT_STDERR=y

COPY ${CHAL_NAME} .
COPY flag.txt .

EXPOSE 8000

