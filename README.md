## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Generate RSA keys for jwt

```bash
# generate private key
$ openssl genrsa -out private.pem 2048

# generate public key
$ openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

Set path to keys in `config/local.json`
```
{
  "RSA": {
    "PRIVATE_KEY_PATH": "path/to/private.pem",
    "PUBLIC_KEY_PATH": "path/to/public.pem"
  }
}
```
