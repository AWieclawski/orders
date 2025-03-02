/**
 * https://www.sqlitetutorial.net/sqlite-nodejs/query/
 * https://www.sqlitetutorial.net/sqlite-nodejs/insert/
 * https://www.sqlitetutorial.net/sqlite-nodejs/delete/
 * SQLite Node.js: Querying Data
 */
const dbConn = require("./dbConn");
const db = dbConn.connection;
const dbUpd = dbConn.connectionUpd;
const errorTxt = dbConn.errorTxt;

const fetchFirst = async (sql, params) => {
    return await dbConn.fetchFirst(db, sql, params)
};


const fetchAll = async (sql, params) => {
    return await dbConn.fetchAll(db, sql, params)
};


const selectedRows = async (sql) => {
    const rows = [];
    return new Promise((resolve, reject) => {
        db.each(sql, (err, row) => {
            if (err) {
                console.error(errorTxt + " querying: " + sql + " | " + err.message);
                reject(err);
            }
            rows.push(row);
        }, () => {
            resolve(rows);
        });
    })
}

const fetchSelected = async (id, entityName, fieldName) => {
    let rows = [];
    let sql = "select * from " + entityName;
    if ((id) && (entityName) && (fieldName)) {
        let where = ' where ';
        if (Array.isArray(id)) {
            let commaIds = id.join(',');
            where = where + fieldName + ' in (' + commaIds + ')';
        } else {
            where = where + fieldName + ' = ' + id + '';
        }
        sql = sql + where;
        rows = await selectedRows(sql)
    }
    return rows;
}


const executeReturning = async (sql, params = []) => {
    let rows = [];
    if (params && params.length > 0) {
        return new Promise((resolve, reject) => {
            dbUpd.run(sql, params, (err, row) => {
                if (err) {
                    console.error(errorTxt + " updating: " + sql + " | " + err.message);
                    reject(err);
                }
                rows.push(row);
            }, () => {
                resolve(rows);
            });
        });
    }
    return new Promise((resolve, reject) => {
        dbUpd.each(sql, (err, row) => {
            if (err) {
                console.error(errorTxt + " updating: " + sql + " | " + err.message);
                reject(err);
            }
            rows.push(row);
        }, () => {
            resolve(rows);
        });
    });
};


module.exports = {
    fetchFirst: fetchFirst,
    fetchSelected: fetchSelected,
    fetchAll: fetchAll,
    selectedRows: selectedRows,
    executeReturning: executeReturning
};