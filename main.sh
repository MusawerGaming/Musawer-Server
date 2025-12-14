#!/bin/sh

# go into velocity folder
cd velocity

# patch listeners.toml
sed -i 's/0.0.0.0:25565/0.0.0.0:25567/g' listeners.toml

# patch eaglerxserver plugin configs
cd plugins
cd eaglerxserver
sed -i 's/localhost:25565/0.0.0.0:25567/g' config.toml

# patch eaglerweb configs
cd ..
cd eaglerweb
cd web
sed -i 's/localhost:25565/0.0.0.0:25567/g' game.html
sed -i 's/localhost:25565/0.0.0.0:25567/g' wasm.html
sed -i 's/localhost:25565/0.0.0.0:25567/g' beta.html

# finally run velocity
cd ../../..
java -Xmx512M -Xms512M -jar velocity-3.4.0-SNAPSHOT.jar
