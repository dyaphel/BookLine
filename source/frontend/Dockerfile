
FROM node:22


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 5173


CMD ["npm", "run", "dev"]



# Explanation:

#     FROM node:18: Uses Node.js 18 as the base image.
    
#     WORKDIR /app: Sets the working directory inside the container.
    
#     COPY package*.json ./: Copies package.json and package-lock.json to the container.
    
#     RUN npm install: Installs dependencies inside the container (this creates /app/node_modules).
    
#     COPY . .: Copies the rest of your React app code.
    
#     EXPOSE 5173: Exposes port 5173 (default for Vite).
    
#     CMD ["npm", "run", "dev"]: Runs the app in development mode.