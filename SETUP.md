# docker (recommended)
### server setup
*if you don't have docker installed yet, go install it then come back*

**pull the [image](https://hub.docker.com/r/userbyte/simbl)**
```sh
docker pull userbyte/simbl:latest
```

**create the container**
```sh
# change these things:
#     $NAME :: desired container and volume docker name
#     $PORT :: the port you want simbl to be exposed on
#   $SECRET :: some super incredibly secret string
export NAME="simbl" \
export PORT="..." \
export SECRET="..." \
docker create -p $PORT:3000 -v $NAME:/app -e JWT_SECRET=$SECRET --name $NAME --restart always userbyte/simbl:latest
```

**start the container**
```sh
docker start $NAME
```
(jump to last section)

---

# node (lil more complicated)

### server setup
*if you don't have node, npm, and yarn installed yet, go install em then come back*

**clone this github repo**
```sh
git clone https://github.com/userbyte/simbl
cd simbl
```

**install dependencies**
```sh
yarn install
```

**set the `JWT_SECRET` environment variable to something super incredibly secret (required) ⚠**

*[spoooky secret generator api](https://api.stringgy.com/?length=30&amount=1&type=ALLNOSYMBOLS)*
```sh
# .env

JWT_SECRET="something_secret"
```
**build**
```sh
yarn run build
```

**start**
```sh
node .next/standalone/server.js
```
(jump to last section)

---

# both node and docker

**once your complete with the server setup, open a browser and go to the setup page:**
- navigate to 127.0.0.1:3000 (or whatever IP and port you're hosting on)
- go to /setup
- create an account
- go back
- release the shitposts