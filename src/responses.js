const fs = require('fs');

let books = [];

//help from ChatGPT
fs.readFile(`${__dirname}/../data/books.json`, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading books.json:', err);
    } else {
        books = JSON.parse(data);
    }
});

const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);

    const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    };

    // send response with json object
    response.writeHead(status, headers);

    // HEAD requests don't get a body back, just the metadata.
    if (request.method === 'POST' || request.method === 'GET') {
        response.write(content);
    }

    response.end();
};

const getBooks = (request, response) => {
    const matchingBooks = books;
    const responseJSON = {
        matchingBooks,
    };
    //console.log('responseJSON: ', responseJSON);

    return respondJSON(request, response, 200, responseJSON);
};


const getBooksTitle = (request, response) => {
    console.log("get books title called");
    const url = new URL(request.url, `http://${request.headers.host}`);
    console.log("url: ", url);
    const searchWord = url.search.slice(7);
    console.log(searchWord);

    const matchingBooks = [];

    console.log("books length: ", books.length);

    for (let i=0; i < books.length; i++) {
        let title = books[i].title;
        console.log(title);
        if (title.includes(searchWord)) {
            console.log(books[i].title);
            matchingBooks.push(books[i]);
        } 
    };

    const responseJSON = {
        matchingBooks,
    };
    console.log("matching books: ", matchingBooks);
    //console.log('responseJSON: ', responseJSON);

    return respondJSON(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    // return a 404 with an error message
    respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    getBooks,
    getBooksTitle,
    notFound,
};