# --- 1. La Base ---
# Empezamos con una caja que ya tiene Node.js v18 (Alpine es una versión ligera)
FROM node:18-alpine

# --- 2. Preparar la Caja ---
# Creamos una carpeta de trabajo DENTRO de la caja
WORKDIR /usr/src/app

# --- 3. Instalar Dependencias ---
# Copiamos solo los "manuales" de dependencias
COPY package*.json ./

# Ejecutamos 'npm install' DENTRO de la caja
# Esto instala express, pg, bcrypt, etc.
RUN npm install

# --- 4. Copiar tu Código ---
# Ahora copiamos el resto del código (index.js, db.js, etc.)
COPY . .

# --- 5. Abrir el Puerto ---
# Le decimos a la caja que la app usará el puerto 4000
EXPOSE 4000

# --- 6. El Comando Final ---
# Le decimos a la caja qué comando ejecutar cuando se encienda
CMD [ "node", "index.js" ]