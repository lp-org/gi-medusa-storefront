FROM node:18.19.0-alpine

RUN mkdir -p /usr/src/app
ENV PORT 3000

WORKDIR /usr/src/app

COPY package.json /usr/src/app

ENV NEXT_SHARP_PATH /tmp/node_modules/sharp

ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL=${NEXT_PUBLIC_MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${NEXT_PUBLIC_MEDUSA_BACKEND_URL}

RUN npm install

COPY . /usr/src/app

RUN npm build

EXPOSE 3000
CMD [ "npm", "start" ]