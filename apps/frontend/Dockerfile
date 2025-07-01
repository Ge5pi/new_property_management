# Make sure to also update Dockerfile.local
# Node 18 LTS. Please upgrade to the next lts once it is available
FROM node:hydrogen-alpine

RUN npm install -g serve

WORKDIR /web
COPY package.json yarn.lock* /web/

RUN yarn --no-progress && rm -rf /tmp/*

COPY . /web/

RUN yarn build

EXPOSE 5000
CMD ["yarn", "start:prod"]
