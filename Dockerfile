FROM alpine

RUN apk update
RUN apk add nodejs
RUN apk add ghostscript
RUN apk add npm
RUN npm install forever -g
RUN npm install formidable

COPY app.js /scripts/

EXPOSE 8080
CMD ["forever", "/scripts/app.js"]