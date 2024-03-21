import express from "express";
import { get, merge } from "lodash";
import { UserModel } from "../models/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(400);
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    // extract the cookie
    const sessionToken = req.cookies[process.env.COOKIE];
    if (!sessionToken) {
      return res.sendStatus(403);
    }

    // if user with existing session
    const existingUser = await UserModel.findOne({
      "authentication.sessionToken": sessionToken,
    });
    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
