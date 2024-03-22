import express from "express";
import authentication from "./authentication";
import users from "./users";
import notes from "./notes";

const routes = express.Router();

routes.use(users);
routes.use(notes);
routes.use(authentication);

export default routes