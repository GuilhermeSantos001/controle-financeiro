import User from "../models/User";
import Profile from "../models/Profile";
import database from "../../database";

interface iUser {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  image: string;
  birthday: string;
}

class UserRepository {
  // Verifica se o email do usuario ja existe no bd
  async findByEmail(email: string): Promise<any> {
    const user = await User.findOne({
      where: { email },
      attributes: ["email", "id"],
    });
    return user;
  }

  async findByUsername(username: string): Promise<any> {
    const user = await User.findOne({
      where: { username },
      attributes: ["username", "id"],
    });
    return user;
  }

  async save({
    email,
    username,
    password,
    firstName,
    lastName,
    image,
    birthday,
  }: iUser): Promise<User> {
    const sequelize = database.connection;
    const transaction = await sequelize.transaction();

    try {
      const user = await User.create<any, any>(
        { email, username, password_hash: password },
        { transaction }
      );

      await Profile.create<any, any>(
        {
          user_id: user.id,
          firstName,
          lastName,
          birthday,
          image,
        },
        { transaction }
      );
      transaction.commit();

      return user;
    } catch (error) {
      transaction.rollback();
      throw new Error(JSON.stringify({ message: "", status: 500 }));
    }
  }
}

export default UserRepository;
