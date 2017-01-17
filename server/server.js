'use strict';
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end('<h1>New Repo</h1>')
})
.listen(process.env.PORT, () => console.log('server started'));