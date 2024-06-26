import express from "express";
import { UserModel } from "../models/users";
import { random, authentication } from "../utils";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await UserModel.findOne({ email }).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }

    // authenticate user without knowing thier password
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403);
    }

    // else login the user
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();

    // and give the cookie
    res.cookie(process.env.COOKIE, user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    // checks
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    // if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.sendStatus(400);
    }

    // create authentication
    const salt = random();
    const user = await UserModel.create({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
