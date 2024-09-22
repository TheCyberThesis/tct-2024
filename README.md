# tct-2024

A centralized remote repository for storing all CTF challenges for `TCT-2024`. 

## Instructions

Please follow the following flag format:

```
TCT{redacted}
```

`dist`: This folder will contain distribution files distributed to users.
`src`: This folder will hold all source files for the challenge.
`sol`: This folder will hold solutions for the challenge (currently only required for pwn and reversing challenges).

Each category will follow a specific folder hierarchy for easy instance deployments:

```
tct-2024
├───misc
│   └───evilFunc
│       ├───dist
│       └───src
├───osint
│   ├───Elon
│   └───mailHub
└───pwn
    ├───passtack
    │   ├───dist
    │   ├───sol
    │   └───src
    └───rooty
        ├───dist
        ├───sol
        └───src
├── web
├── reversing
├── forensics
└── osint
```

Please ensure that each challenge is organized within its respective category folder using the provided structure.

Categories to be added are:

- [x] PWN
- [x] Web Exploitation
- [x] Misc
- [x] Reversing
- [x] Forensics
- [x] Crypto
- [x] Osint
- [x] Mobile
