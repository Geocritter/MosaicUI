FROM node:13.10

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install

RUN npm install react
RUN npm install react-scripts -g

RUN npm install @material-ui/core -g
RUN npm install @material-ui/styles -g
RUN npm install @google/earthengine



EXPOSE 3000
CMD ["npm", "start"]