module.exports = function(express, app, passport, config){
    
    var router = express.Router();
    
    router.get('/', (req, res, next) => {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end('<h1>Express route</h1>');
    });
    
    app.use('/', router);
}