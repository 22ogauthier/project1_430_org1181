const http = require('http');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const parseBody = (request, response, handler) => {
    const body = [];

    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    request.on('data', (chunk) => {
        body.push(chunk);
    });

    request.on('end', () => {
        const bodyString = Buffer.concat(body).toString();
        request.body = query.parse(bodyString);
        handler(request, response);
    });
};

const handlePost = (request, response, parsedUrl) => {
    // If they go to /addUser
    if (parsedUrl.pathname === '/addBook') {
        parseBody(request, response, responseHandler.addBook);
    } else if (parsedUrl.pathname === '/addRating') {
        parseBody(request, response, responseHandler.addRating);
    }
};

const handleGet = (request, response, parsedUrl) => {
    console.log("handle get called");
    console.log("parsedUrl:", parsedUrl.pathname);
    // route to correct method based on url
    if (parsedUrl.pathname === '/') {
        htmlHandler.getIndex(request, response);
    } else if (parsedUrl.pathname === '/doc.html') {
        htmlHandler.getDoc(request, response);
    } else if (parsedUrl.pathname === '/style.css') {
        htmlHandler.getCSS(request, response);
    } else if (parsedUrl.pathname === '/getBooks') {
        responseHandler.getBooks(request, response);
    } else if (parsedUrl.pathname === '/getBooksTitles') {
        responseHandler.getBooksTitle(request, response);
    } else if (parsedUrl.pathname === '/getBooksAuthor') {
        responseHandler.getBooksAuthor(request, response);
    } else if (parsedUrl.pathname === '/getBooksGenres') {
        responseHandler.getBooksGenres(request, response);
    } else {
        responseHandler.notFound(request, response);
    }
};

const onRequest = (request, response) => {
    console.log("onrequest called");
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    console.log("Incoming request:", request.method, parsedUrl.pathname);

    if (request.method === 'POST') {
        console.log("routing to handlePost");
        handlePost(request, response, parsedUrl);
    } else {
        console.log("routing to handleGet");
        handleGet(request, response, parsedUrl);
    }
};

http.createServer(onRequest).listen(port, "0.0.0.0", () => {
    console.log(`Listening on 0.0.0.0:${port}`);
});