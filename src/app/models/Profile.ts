import { Model, DataTypes, Sequelize } from "sequelize";

class Profile extends Model {
  static init(sequelize): any {
    super.init<any, Sequelize>(
      {
        user_id: DataTypes.INTEGER,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        birthday: DataTypes.STRING,
        image: DataTypes.STRING,
      },
      { sequelize, tableName: "profiles" }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default Profile;
