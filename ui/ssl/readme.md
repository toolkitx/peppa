Local https certs


https://gist.github.com/cecilemuller/9492b848eb8fe46d462abeb26656c4f8

Domain name certificate
Let's say you have two domains fake1.local and fake2.local that are hosted on your local machine for development (using the hosts file to point them to 127.0.0.1).

First, create a file domains.ext that lists all your local domains:

```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
DNS.2 = fake1.local
DNS.3 = fake2.local
```
Generate localhost.key, localhost.csr, and localhost.crt:
```
openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"
openssl x509 -req -sha256 -days 1024 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile domain.ext -out localhost.crt
```
Note that the country / state / city / name in the first command can be customized.

You can now configure your webserver, for example with Apache:
```
SSLEngine on
SSLCertificateFile "C:/example/localhost.crt"
SSLCertificateKeyFile "C:/example/localhost.key"
```
