require('dotenv').config();


export const config = {
    db_host: process.env.db_host,
    db_username: process.env.db_username,
    db_password: process.env.db_password,
    database: process.env.database,
    db_connection_limit: process.env.db_connection_limit,
    jwt_secret_key: process.env.TOKEN_KEY,
    jwt_expiry: process.env.jwtTokenExpirationMore
}

