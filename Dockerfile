FROM nginx:latest
MAINTAINER children-garments-frontend
COPY /dist/ /usr/share/nginx/html/
EXPOSE 80
