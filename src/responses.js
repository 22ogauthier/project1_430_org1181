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

    if (request.method === 'HEAD') {
        return respondJSON(request, response, 204, responseJSON);
    }
    return respondJSON(request, response, 200, responseJSON);
};

const getBooksTitle = (request, response) => {
    let searchWord = "";
    const url = new URL(request.url, `http://${request.headers.host}`);

    url.searchParams.forEach(function (value, key) {
        searchWord = value;
    });

    let responseJSON;

    if (searchWord == '') {
        responseJSON = {
            message: 'Missing title search parameter',
        };
        return respondJSON(request, response, 400, responseJSON);
    } else {
        const matchingBooks = [];

        for (let i = 0; i < books.length; i++) {
            let title = books[i].title;
            if (title.includes(searchWord)) {
                matchingBooks.push(books[i]);
            }
        };
        responseJSON = {
            matchingBooks,
        };
        if (request.method === 'HEAD') {
            return respondJSON(request, response, 204, responseJSON);
        }
        return respondJSON(request, response, 200, responseJSON);
    }
};

const getBooksAuthor = (request, response) => {
    let searchWord = "";
    const url = new URL(request.url, `http://${request.headers.host}`);

    url.searchParams.forEach(function (value, key) {
        searchWord = value;
    });

    let responseJSON;

    if (searchWord == '') {
        responseJSON = {
            message: 'Missing author search parameter',
        };
        return respondJSON(request, response, 400, responseJSON);
    } else {
        const matchingBooks = [];

        for (let i = 0; i < books.length; i++) {
            let author = books[i].author;
            if (author.includes(searchWord)) {
                matchingBooks.push(books[i]);
            };
        };

        responseJSON = {
            matchingBooks,
        };
        if (request.method === 'HEAD') {
            return respondJSON(request, response, 204, responseJSON);
        }
        return respondJSON(request, response, 200, responseJSON);
    }
};

const getBooksGenres = (request, response) => {
    let searchWord = "";
    const url = new URL(request.url, `http://${request.headers.host}`);

    url.searchParams.forEach(function (value, key) {
        searchWord = value;
    });

    let responseJSON;

    if (searchWord == '') {
        responseJSON = {
            message: 'Missing genre search parameter',
        };
        return respondJSON(request, response, 400, responseJSON);
    } else {
        const matchingBooks = [];

        for (let i = 0; i < books.length; i++) {
            if (books[i].genres) {
                for (let y = 0; y < books[i].genres.length; y++) {
                    let genre = books[i].genres[y];
                    if (genre.toLowerCase().includes(searchWord.toLowerCase())) {
                        matchingBooks.push(books[i]);
                    };
                }
            }
        };
        responseJSON = {
            matchingBooks
        };
        if (request.method === 'HEAD') {
            return respondJSON(request, response, 204, responseJSON);
        }
        return respondJSON(request, response, 200, responseJSON);
    };
};

const addBook = (request, response) => {
    const { author, country, language, link, pages, title, year, genres } = request.body;

    let book = {
        author: author,
        country: country,
        language: language,
        link: link,
        pages: pages,
        title: title,
        year: year,
        genres: genres,
    };
    books.push(book);
    return respondJSON(request, response, 201, {});
};

const addRating = (request, response) => {
    const { title, rating } = request.body;
    let match = false;
    let responseJSON;

    if (!title || !rating) {
        console.log("Missing parameters for add rating");
        return respondJSON(request, response, 400, {});
    }

    for (let i = 0; i < books.length; i++) {
        if (books[i].title == title) {
            books[i].rating = rating;
            match = true;
        }
    }

    if (!match) {
        console.log("The book you are looking for does not exist.");
        return respondJSON(request, response, 404, {});
    };

    return respondJSON(request, response, 201, {});
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
    getBooksAuthor,
    getBooksGenres,
    addBook,
    addRating,
    notFound,
};