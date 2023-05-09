module.exports = function(app){
    app.get('/api/', (req, res) => {
        res.status(200).end();
    });
    
    app.get('/', (req, res) => {
        res.status(200).end();
    });
}

