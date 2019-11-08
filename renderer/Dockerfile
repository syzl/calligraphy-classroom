# Do the npm install or yarn install in the full image
FROM node:12-alpine AS builder
WORKDIR /app
COPY package.json .

RUN npm config set registry https://registry.npm.taobao.org/
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn install

COPY . .

ENV SERVER_URL $SERVER_URL
ENV WS_SERVER_URL $WS_SERVER_URL
ENV GQL_URI $GQL_URI
ENV GQL_WS_URI $GQL_WS_URI

RUN yarn build && yarn --production

# And then copy over node_modules, etc from that stage to the smaller base image

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
