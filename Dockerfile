FROM node

WORKDIR /usr/app

COPY package*.json .

# if you have any proxy in your network
#RUN yarn config set proxy http://USER:PASSWORD@PROXY_URL:PROXY_PORT
RUN yarn install

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]