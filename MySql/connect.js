const mysql = require('mysql');

const connection = mysql.createConnection({                                     //its better to use ENV params
    host: 'ben1e8tljjivtlkrlih5-mysql.services.clever-cloud.com',
    user: 'uv68wkbxill75bjc',
    password: 'SQWjlU4uQEFBPGAmdUcL',
    database: 'ben1e8tljjivtlkrlih5',
//    connectionLimit : 1,
});

module.exports.connection = connection;