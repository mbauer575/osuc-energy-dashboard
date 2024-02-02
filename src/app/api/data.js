const { poolPromise } = require('./db.js');

async function getData() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM resTest1 WHERE CONVERT(DATE, dateTime) = CONVERT(DATE, GETDATE()) ORDER BY dateTime');
        return result.recordset;
    } catch (err) {
        console.error(err);
    }
}

module.exports = getData;