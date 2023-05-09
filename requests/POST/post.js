const {addNewUser, createPost, loadAvatar, storeFollow, delFollow} = require('../../MySql/queries');

module.exports = function(app, upload){
    //reg new user:
    app.post('/api/reg', (req, res) => {
        const data = req.body;
        addNewUser(res, data.Login, data.Password, data.Name, data.Surname);
    });

    //save new post:
    app.post('/api/create-post', upload.single('caption-img'), (req, res) => {
        const data = req.body;
        const fileKey = req.file ? req.file.key : '';
        createPost(res, fileKey, data.authorId, data.caption);
    });

    //load avatar:
    app.post('/api/load-avatar', upload.single('avatar'), (req, res) => {
        const data = req.body;
        loadAvatar(res, data.id, req.file.key);
    });

    //reg new follower
    app.post('/api/follow', (req, res) => {
        const data = req.body;
        console.log(data.userId, data.followerId)
        storeFollow(res, data.userId, data.followerId);
    });

    //delete follower
    app.post('/api/unfollow', (req, res) => {
        const data = req.body;
        console.log(data.userId, data.followerId)
        delFollow(res, data.userId, data.followerId);
    });
}