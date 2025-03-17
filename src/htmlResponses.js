const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const doc = fs.readFileSync(`${__dirname}/../client/doc.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to handle the index page
const getIndex = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(index, 'utf8'),
  });
  response.write(index);
  response.end();
};

const getDoc = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': Buffer.byteLength(doc, 'utf8'),
  });
  response.write(doc);
  response.end();
};

// function to handle the css page
const getCSS = (request, response) => {
  response.writeHead(200, {
    'Content-Type': 'text/css',
    'Content-Length': Buffer.byteLength(css, 'utf8'),
  });
  response.write(css);
  response.end();
};

module.exports = {
  getIndex,
  getCSS,
  getDoc,
};
