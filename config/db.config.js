require("dotenv").config();

const STRING = (value) => {
  if (value) {
    return value;
  }
};

module.exports = {
  HOST: process.env.POSTGRESQL_DB_HOST,
  USER: process.env.POSTGRESQL_DB_USER,
  PASSWORD: STRING(process.env.POSTGRESQL_DB_PASSWORD),
  DB: process.env.POSTGRESQL_DB,
  ssl: false,
  dialect: "postgres",
  // declaring pool is optional
  // pool: {
  //   max: 5,
  //   min: 0,
  //   acquire: 30000,
  //   idle: 10000
  // }
};
