import { Router } from "express";
import classController from "../controllers/class_controller.js";

const router = Router();

router.get("/", classController.getAll);
router.get("/:id", classController.getById);
router.post("/", classController.create);
router.put("/:id", classController.update);
router.delete("/:id", classController.remove);

export default router;