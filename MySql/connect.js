const mysql = require('mysql');

const pool = mysql.createPool({                                     //its better to use ENV params
    host: 'ben1e8tljjivtlkrlih5-mysql.services.clever-cloud.com',
    user: 'uv68wkbxill75bjc',
    password: 'SQWjlU4uQEFBPGAmdUcL',
    database: 'ben1e8tljjivtlkrlih5',
    connectionLimit : 4,
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

module.exports.pool = pool;