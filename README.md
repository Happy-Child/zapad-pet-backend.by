## Внешние зависимости:
`docker, docker-compose, npx, nodejs, yarn`


## Запуск проекта
1. `touch config/local.json`
2. `docker-compose -f docker-compose.develop.yml up -d`
3. `yarn`
4. `yarn prepare-db`
5. `yarn start:dev`

[Открыть в браузере](http://localhost:3000/api)

## Настройки почтового сервиса (опционально)
⚠️ Вы можете пропустить эту секцию если не собираетесь использовать сервис для работы с почтой (sign-in/sign-up/...)

В файле `config/local.json` заполните поле `MAIL_SENDER` соответствущими данными. Пример в `default.json`.


## Генерация RSA ключей для JWT сервиса (опционально)

⚠️ Вы можете оставить существующие демонстрационные ключи `private/public.pub` и пропустить эту секцию.


```bash
# приватный
$ openssl genrsa -out ./path/to/private.pem 2048

# публичный
$ openssl rsa -in private.pem -outform PEM -pubout -out ./path/to/public.pem
```

Обновите пути к ключам в `config/local.json`
```
{
  "RSA": {
    "PRIVATE_KEY_PATH": "path/to/private.pem",
    "PUBLIC_KEY_PATH": "path/to/public.pem"
  }
}
```
