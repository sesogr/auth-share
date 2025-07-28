## execute in root dir of this repo

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout service/certs/mykey.key -out service/certs/mycert.crt
