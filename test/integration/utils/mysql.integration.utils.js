module.exports.selectMySql2 = (mysql2) => {
    return new Promise((resolve) => {
        const connection = mysql2.createConnection({
            host: 'localhost',
            user: 'user',
            database: 'db',
            password: 'userpass',
        });

        connection.query('SELECT 1 + 1 AS solution', () => {
            connection.end((err, data) => {
                if (err) {
                    // Resolve even though there is an error.
                    return resolve(err);
                }
                return resolve(data);
            });
        });
    });
};

module.exports.selectMySql = (mysql) => {
    return new Promise((resolve) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'user',
            database: 'db',
            password: 'userpass',
        });

        connection.query('SELECT 1 + 1 AS solution', () => {
            connection.end((err, data) => {
                if (err) {
                    // Resolve even though there is an error.
                    return resolve(err);
                }
                return resolve(data);
            });
        });
    });
};

