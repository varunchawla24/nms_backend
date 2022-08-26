const mysql = require('mysql');
import {config} from "./config"

const pool  = mysql.createPool({
    connectionLimit :  config.db_connection_limit,
    host            :  config.db_host,
    user            :  config.db_username,
    password        :  config.db_password,
    database        : config.database
  });


  module.exports = pool