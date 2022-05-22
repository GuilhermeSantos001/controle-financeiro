import { Request, Response } from "express";
import database from "../../database";
import User from "../models/User";

import CreateUserService from "../Services/CreateUserService";
import UserRepository from "../Repositories/UserRepository";

class UserController {
  async findAll(req: Request, res: Response): Promise<Response> {
    const users = await User.findAll({
      include: [
        {
          association: "profile",
        },
      ],
    });
    return res.json(users);
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const id = req.params.userID;
    const user = await User.findOne({ where: { id } });

    return user ? res.json(user) : res.status(204).send();
  }

  async create(req: Request, res: Response): Promise<Response> {
    const sequelize = database.connection;
    const transaction = await sequelize.transaction();

    const { email, username, password, firstName, lastName, birthday, image } =
      req.body;

    try {
      const service = new CreateUserService(new UserRepository());

      const user = await service.execute({
        email,
        username,
        password,
        firstName,
        lastName,
        image,
        birthday,
      });

      return res.status(201).json(user);
    } catch (error) {
      const { message, status } = JSON.parse(error.message);
      return res.status(status).json(message);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { email, username, password } = req.body;
    const id = req.params.userID;

    await User.update(
      {
        email,
        username,
        password,
      },
      { where: { id } }
    );

    return res.status(204).send();
  }

  async destroy(req: Request, res: Response): Promise<Response> {
    const id = req.params.userID;

    await User.destroy({ where: { id } });

    return res.status(204).json();
  }
}

export default new UserController();
