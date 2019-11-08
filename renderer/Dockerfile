# Do the npm install or yarn install in the full image
FROM node:12-alpine AS builder
WORKDIR /app
COPY package.json .

RUN npm config set registry https://registry.npm.taobao.org/
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn install

COPY . .

ENV SERVER_URL https://calli.songlairui.cn
ENV WS_SERVER_URL wss://calli.songlairui.cn
ENV GQL_URI https://calli.songlairui.cn/graphql
ENV GQL_WS_URI wss://calli.songlairui.cn/graphql

RUN echo "Oh dang look at SERVER_URL: $SERVER_URL"

RUN yarn build && yarn --production

# And then copy over node_modules, etc from that stage to the smaller base image

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
