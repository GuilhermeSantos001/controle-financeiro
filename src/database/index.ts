import { Sequelize, Dialect } from "sequelize";

import databaseConfig from "../config/database";

import Models from "../app/models";

// seta type dialect
const dbConfig = {
  ...databaseConfig,
  dialect: process.env.DB_DRIVER as Dialect,
};

class Database {
  public connection: Sequelize;

  constructor() {
    this.init();
  }

  init(): void {
    this.connection = new Sequelize(dbConfig);
    Object.keys(Models).map((object, i) => {
      const model = Object.values(Models)[i];
      if (model.init) model.init(this.connection);
    });

    Object.keys(Models).forEach((object, i) => {
      const model = Object.values(Models)[i];
      if (model.associate) model.associate(this.connection.models);
    });
  }
}

const database: Database = new Database();

export default database;
