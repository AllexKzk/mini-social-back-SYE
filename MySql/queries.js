const {connection} = require('./connect');
const {hashString} = require('./hash');

function collectFollowers(res, userId, updata = null){
    
    connection.query(`SELECT user AS id, u.name AS name, u.surname AS surname FROM Followers f
                LEFT JOIN (SELECT id, name, surname FROM User) AS u 
                ON f.user = u.id
                WHERE f.follower = '${userId}
                GROUP BY f.follower'`, 
        function(err, follows){
            if (err){
                res.statusMessage = err.message;
                res.status(500);
            }
            else{
                res.send({...updata, friends: follows});
            }
            res.end();
            
    });
}

function authUser(res, login, password){
    const hashPassword = hashString(password);
    
    connection.query(`SELECT id, password FROM User
                WHERE login = '${login}' AND password = '${hashPassword}'`, function(err, users) {
        if(err){
            res.statusMessage = err;
            res.status(500).end();
            return console.log(err);
        }
        if (users.length){                  //at least one user
            const updata = {
                id: users[0].id,
                token: users[0].password,   //token is a lie
            };
            collectFollowers(res, users[0].id, updata);
            return ;
        }
        res.statusMessage = 'Wrong login or password';
        res.status(404).end();             //no matches
    });
    
}

function authByToken(res, id, token){
    
    connection.query(`SELECT id, password FROM User
                WHERE id = '${id}' AND password = '${token}'`, function(err, users) {
        if(err) {
            res.statusMessage = err.message;
            res.status(500);
        }
        if (users.length){             
            collectFollowers(res, users[0].id, users[0]);
            return ;
        }
        res.status(404).end();
        
    });
}

function addNewUser(res, login, password, name, surname) {
    const hashPassword = hashString(password);
    
    connection.query(`INSERT INTO User (login, password, name, surname) VALUES ('${login}', '${hashPassword}', '${name}', '${surname}');`, function(err) {
        if(err) {
            res.statusMessage = err.message;
            res.status(500);
        }
        
        authUser(res, login, password);
    });
}

function getUser(res, id){
    
    connection.query(`SELECT name, surname, bio, avatar FROM User u
                WHERE u.id = '${id}'`, function(err, users) {
        if(err){
            res.statusMessage = err.message;
            res.status(500);
        }
        if (users.length){
            collectFollowers(res, id, users[0]);
            return ;
        }
        else{
            res.statusMessage = "Uncorrect password or login";
            res.status(404);
        }
        res.end();
        
    });
}

function updateProfileData(res, id, field, value){
    
    connection.query(`UPDATE User SET ${field} = '${value}' WHERE id = '${id}'`, function(err) {
        if(err) {
            res.statusMessage = err.message;
            res.status(500);
        }
        res.end();
        
    });
}

function storeFollow(res, userId, followerId) {
    
    connection.query(`INSERT INTO Followers (user, follower) VALUES ('${userId}', '${followerId}')`, function(err){
        if (err){
            res.statusMessage = err.message;
            res.status(500);
        }
        else
            res.status(200);
        res.end();
        
    });
}

function delFollow(res, userId, followerId) {
    
    connection.query(`DELETE FROM Followers WHERE user = '${userId}' AND follower = '${followerId}'`, function(err){
        if (err){
            res.statusMessage = err.message;
            res.status(500);
        }
        else
            res.status(200);
        res.end();
        
    });
}

function createPost(res, path, authorId,  caption){
    
    connection.query(`INSERT INTO Posts (author, image_path, caption) VALUES ('${authorId}', '${path}', '${caption}')`, function(err){
        if (err){
            res.statusMessage = err.message;
                res.status(500);
        }
        else
            res.status(200)
        res.end();
        
    })
}

function collectPosts(res, sources, reqUserId, maxId){
    
    const limitForId = maxId !== '0' ? `p.id < ${maxId}` : 'p.id > 0';
    connection.query(`SELECT p.id, p.author AS authorId, u.name AS authorName, u.surname AS authorSurname, p.caption, p.image_path AS imagePath, l.likes AS likes, l.liked AS liked  
                FROM Posts p
                LEFT JOIN User u ON u.id = p.author
                LEFT JOIN (SELECT COUNT(author_id) AS likes, post_id, IF( FIND_IN_SET('${reqUserId}', GROUP_CONCAT(author_id)), True, False) AS liked
                            FROM Likes GROUP BY post_id) l ON l.post_id  = p.id
                WHERE FIND_IN_SET(p.author, "${sources.join()}") > 0 AND ${limitForId} 
                ORDER BY p.id DESC
                LIMIT 2;`, 
        function(err, collection){
            if (err){
                res.statusMessage = err.message;
                res.status(500);
            }
            else{
                res.send(collection);
            }
            res.end();
            
    });
}

function likedPost(res, post_id, author_id){
    
    connection.query(`INSERT INTO Likes (post_id, author_id) VALUES (${post_id}, ${author_id});`, 
        function(err){
            if (err){
                res.statusMessage = err.message;
                res.status(500);
            }
            else{
                res.status(200);
            }
            res.end();
            
    });
}

function loadAvatar(res, id, path){
    
    connection.query(`UPDATE User SET avatar = '${path}' WHERE id = '${id}';`, 
        function(err){
            if (err){
                res.statusMessage = err.message;
                res.status(500);
            }
            else{
                res.status(200);
            }
            res.end();
    });
    
}

module.exports = {addNewUser, authUser, getUser, updateProfileData, createPost, collectPosts, likedPost, loadAvatar, storeFollow, delFollow, authByToken};

