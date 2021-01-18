https://hub.docker.com/r/garychan8523/ghostscript-service

build:
- docker build -t ghostscript-service .

usage:
- create a system path, create "in" and "out" folder under the path
- docker run -v [system-path]:/home --rm -it -p 8080:8080 garychan8523/ghostscript-service

check logs:
- docker log [image-id]
