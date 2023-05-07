const {pool} = require('./connect');
const {hashString} = require('./hash');

function authUser(res, login, password){
    const hashPassword = hashString(password);

    pool.query(`SELECT id, login, password FROM User WHERE login = '${login}' AND password = '${hashPassword}'`, function(err, users) {
        if(err) 
            return console.log(err);
        if (users.length)       //at least one user
            return res.send(users[0]);
        else                    //no matches
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
    pool.query(`SELECT name, surname, bio FROM User WHERE id = '${id}'`, function(err, users) {
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

module.exports = {addNewUser, authUser, getUser, updateProfileData};

