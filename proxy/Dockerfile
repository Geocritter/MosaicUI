FROM nginx:1.15.10-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY dev.conf /etc/nginx/conf.d/dev.conf
##COPY certificate.pem /etc/ssl/certs/
##COPY key.pem /etc/ssl/private/