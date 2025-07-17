FROM node:20.17.0-alpine3.20 
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
CMD ["yarn", "start"]
