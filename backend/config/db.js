module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",
    DB: "lekaakou_db",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};

/* module.exports = {
  HOST: "localhost",
  USER: "epanzyco_lekaakou",
  PASSWORD: "O]y_$01_MnCB",
  DB: "epanzyco_lekaakou_db",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}; */