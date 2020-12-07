FROM node:15-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

RUN npm install react
RUN npm install react-scripts -g

RUN npm install @material-ui/core -g
RUN npm install @material-ui/styles -g
RUN npm install --save @google/earthengine



EXPOSE 3000
CMD ["npm", "start"]