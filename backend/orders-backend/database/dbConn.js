const sqlite3 = require("sqlite3").verbose();
const fileName = "./database/orders.sqlite";
const errorTxt = "Error while";

const connection = new sqlite3.Database(fileName,
    sqlite3.OPEN_READONLY, (err, row) => {
        if (err) return console.error.apply(err.message);
        console.log("Connected to read the database: orders");
    });

const connectionUpd = new sqlite3.Database(fileName,
    sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error.apply(err.message);
        console.log("Connected to read and write the database: orders");
    });


class DbTest {
    doDbTests = async (db) => {
        let alias = 'version';
        let rows = await fetchFirst(db, 'select sqlite_version() as ' + alias);
        console.log('DataBase version:', rows[alias]);
        alias = 'tabName'; // use this name to map `rows` results
        rows = await fetchAll(db, `SELECT name ${alias}
                                   FROM main.sqlite_master
                                   WHERE type = 'table'
                                     AND name NOT LIKE 'sqlite_%'`);
        const tables = rows.map(({tabName}) => tabName).join(', ');
        console.log('Found tables:', tables);
    }
}

const fetchFirst = async (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error(errorTxt + " querying: " + sql + " | " + err.message);
                reject(err);
            }
            resolve(row);
        });
    });
};

const fetchAll = async (db, sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error(errorTxt + " querying: " + sql + " | " + err.message);
                reject(err);
            }
            resolve(rows);
        });
    });
};


const testDatabase = new DbTest().doDbTests(connection);

module.exports = {
    connection: connection,
    connectionUpd: connectionUpd,
    fetchFirst: fetchFirst,
    fetchAll: fetchAll,
    errorTxt: errorTxt
};
