import express from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/notes";

export default (router: express.Router) => {
  router.get("/notes", getNotes);
  router.post("/notes", createNote);
  router.delete("/notes/:id", deleteNote);
  router.patch("/notes/:id", updateNote);
};
