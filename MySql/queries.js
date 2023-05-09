const {pool} = require('./connect');
const {hashString} = require('./hash');

function authUser(res, login, password){
    const hashPassword = hashString(password);

    pool.query(`SELECT id, password FROM User WHERE login = '${login}' AND password = '${hashPassword}'`, function(err, users) {
        if(err) 
            return console.log(err);
        if (users.length){                  //at least one user
            return res.send({
                id: users[0].id,
                token: users[0].password,   //token is a lie
            });
        }
        else                                //no matches
            res.status(404);
        res.end();
    });
}

function authUserByToken(res, id, token){
    pool.query(`SELECT login FROM User WHERE id = '${id}' AND password = '${token}'`, function(err, users) {
        if(err) 
            return console.log(err);
        if (users.length){                  //at least one user
            res.status(200);
        }
        else                                //no matches
            res.status(404);
        res.end();
    });
}

function addNewUser(res, login, password, name, surname) {
    const hashPassword = hashString(password);

    pool.query(`INSERT INTO User (login, password, name, surname) VALUES ('${login}', '${hashPassword}', '${name}', '${surname}');`, function(err) {
        if(err) 
            return console.log(err);
        authUser(res, login, password);
    });
}

function getUser(res, id){
    pool.query(`SELECT name, surname, bio, avatar FROM User WHERE id = '${id}'`, function(err, users) {
        if(err)
            return console.log(err);
        if (users.length)
            res.send(users[0]);
        else{
            res.statusMessage = "Uncorrect password or login";
            res.status(404);
        }
        res.end();
    });
}

function updateProfileData(res, id, field, value){
    pool.query(`UPDATE User SET ${field} = '${value}' WHERE id = '${id}'`, function(err) {
        if(err) {
            return console.log(err);
        }
        res.end();
    });
}

function createPost(res, path, authorId,  caption){
    pool.query(`INSERT INTO Posts (author, image_path, caption) VALUES ('${authorId}', '${path}', '${caption}')`, function(err){
        if (err)
            res.status(500);
        else
            res.status(200)
        res.end();
    })
}

function collectPosts(res, sources, reqUserId){
    pool.query(`SELECT p.id, p.author AS authorId, u.name AS authorName, u.surname AS authorSurname, p.caption, p.image_path AS imagePath, l.likes AS likes, l.liked AS liked  
                FROM Posts p
                LEFT JOIN User u ON u.id = p.author
                LEFT JOIN (SELECT COUNT(author_id) AS likes, post_id, IF( FIND_IN_SET('${reqUserId}', GROUP_CONCAT(author_id)), True, False) AS liked
                            FROM Likes GROUP BY post_id) l ON l.post_id  = p.id
                WHERE FIND_IN_SET(p.author, "${sources.join()}") > 0 
                ORDER BY p.id DESC;`, 
        function(err, collection){
            if (err){
                console.log(err);
                res.status(500);
            }
            else{
                res.send(collection);
            }
            res.end();
    });
}

function likedPost(res, post_id, author_id){
    pool.query(`INSERT INTO Likes (post_id, author_id) VALUES (${post_id}, ${author_id});`, 
        function(err){
            if (err){
                console.log(err);
                res.status(500);
            }
            else{
                res.status(200);
            }
            res.end();
    });
}

function loadAvatar(res, id, path){
    pool.query(`UPDATE User SET avatar = '${path}' WHERE id = '${id}';`, 
        function(err){
            if (err){
                console.log(err);
                res.status(500);
            }
            else{
                res.status(200);
            }
            res.end();
    });
}

module.exports = {addNewUser, authUser, getUser, updateProfileData, authUserByToken, createPost, collectPosts, likedPost, loadAvatar};

