const sql = require('mssql');

module.exports = async function (context, req) {
    context.log("Fetching resource requests.");

    const config = {
        user: process.env.AZURE_SQL_USER,
        password: process.env.AZURE_SQL_PASSWORD,
        server: process.env.AZURE_SQL_SERVER, 
        database: process.env.AZURE_SQL_DATABASE,
        options: {
            encrypt: true,
            trustServerCertificate: false
        }
    };

    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query("SELECT RequestID, ItemName, Quantity, Requester, Status FROM ResourceRequests");
        context.res = {
            status: 200,
            body: result.recordset,
            headers: { "Content-Type": "application/json" }
        };
    } catch (err) {
        context.log.error("Error: ", err);
        context.res = {
            status: 500,
            body: "Database connection failed."
        };
    }
};
