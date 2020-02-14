FROM node:10
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN node -v
RUN npm --version
RUN yarn --version
RUN yarn
RUN yarn global add create-react-app
CMD ["yarn", "start"]
