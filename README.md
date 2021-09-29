# Specification by Example: Battleship

This repository shows how to apply "Specification by Example" to the computer version of the pen and paper game Battleship.

## Getting started

### Build Server

``` bash
cd server
npm install
```

Verify the specification.

``` bash
npm test
```

### Build UI

``` bash
cd ui
npm install
npm run-script build
```

### Build Docker Image

```
docker build -t <image name> .
```

### Run Docker Container

```
docker run -p 8888:8888 --rm --name battleship <image name>
```