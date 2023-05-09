const {authUser, getUser, updateProfileData, collectPosts, likedPost, authByToken} = require('../../MySql/queries');

module.exports = function(app, s3){
    app.put('/api/login', (req, res) => {
        const data = req.body;
        authUser(res, data.Login, data.Password);
    });

    app.put('/api/user', (req, res) => {
        const data = req.body;
        getUser(res, data.id);
    });

    app.put('/api/update-user', (req, res) => {
        const data = req.body;
        updateProfileData(res, data.id, data.field[0], data.field[1])
    });

    app.put('/api/bytoken', (req, res) => {
        const data = req.body;
        authByToken(res, data.id, data.token, true);
    });

    app.put('/api/get-posts', (req, res) => {
        const data = req.body;
        collectPosts(res, data.sources, data.reqUserId);
    });

    app.put('/api/like', (req, res) => {
        const data = req.body;
        likedPost(res, data.postId, data.authorId);
    });

    app.put('/api/image', (req, res) => {
        if (req.body.key){
            const signedUrl = s3.getSignedUrl('getObject', {
                Bucket: process.env.CYCLIC_BUCKET_NAME,
                Key: req.body.key,
                Expires: 1800
            });
            res.send( {signedSrc: signedUrl} );
        }
        else
            res.status(404);
        res.end();
    });
}