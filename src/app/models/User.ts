import { Model, DataTypes, Sequelize, HasOne } from "sequelize";
import bcrypt from "bcrypt";
class User extends Model {
  email: string;
  username: string;
  password: string;

  static init(sequelize): any {
    super.init<any, Sequelize>(
      {
        email: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        password_hash: DataTypes.VIRTUAL,
      },
      { sequelize, tableName: "users" }
    );

    this.addHook("beforeSave", async (user: any) => {
      if (user.password_hash)
        user.password = await bcrypt.hash(user.password_hash, 8);
    });
  }

  async password_check(password: string): Promise<boolean> {
    const newPassword = await bcrypt.compare(password, this.password);
    return newPassword;
  }

  static associate(models) {
    this.hasOne(models.Profile, { foreignKey: "user_id", as: "profile" });
  }
}

export default User;
