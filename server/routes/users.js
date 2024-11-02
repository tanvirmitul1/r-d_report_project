import express from "express";
import {
  getUsers,
  getUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

export default router;
