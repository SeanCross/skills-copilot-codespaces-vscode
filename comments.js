// create web server
// 1. load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 2. create server
var server = http.createServer(function (request, response) {
    // 2.1 get url
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    console.log(resource);

    // 2.2 if get method
    if (request.method === 'GET') {
        if (resource === '/') {
            fs.readFile('./index.html', 'utf-8', function (error, data) {
                if (error)
                    throw error;
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(data);
            });
        } else if (resource === '/comments') {
            fs.readFile('./comments.json', 'utf-8', function (error, data) {
                if (error)
                    throw error;
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(data);
            });
        } else {
            fs.readFile('.' + resource, 'utf-8', function (error, data) {
                if (error) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end('<h1>404 Page Not Found!</h1>');
                } else {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(data);
                }
            });
        }
    } else if (request.method === 'POST') {
        if (resource === '/comments') {
            // 2.3 read message
            request.on('data', function (chunk) {
                var parsedBody = qs.parse(chunk.toString());
                var comment = parsedBody.comment;
                var name = parsedBody.name;
                console.log(parsedBody);
                console.log(comment);
                console.log(name);

                // 2.3.1 save message
                fs.readFile('./comments.json', 'utf-8', function (error, data) {
                    if (error)
                        throw error;
                    var comments = JSON.parse(data);
                    comments.push({ name: name, comment: comment });
                    console.log(comments);

                    // 2.3.2 write message
                    fs.writeFile('./comments.json', JSON.stringify(comments), function (error) {
                        if (error)
                            throw error;
                        console.log('The "data to append" was appended to file!');
                    });
                });
            });
        }