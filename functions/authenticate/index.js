const sql = require('mssql');

module.exports = async function (context, req) {
    context.log("Processing authentication request.");

    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        context.res = {
            status: 400,
            body: "Missing credentials."
        };
        return;
    }

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
        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query("SELECT Role FROM Users WHERE Username = @username AND PasswordHash = @password");

        if (result.recordset.length > 0 && result.recordset[0].Role === role) {
            context.res = {
                status: 200,
                body: { success: true }
            };
        } else {
            context.res = {
                status: 401,
                body: { success: false }
            };
        }
    } catch (err) {
        context.log.error("Error: ", err);
        context.res = {
            status: 500,
            body: "Database connection failed."
        };
    }
};
