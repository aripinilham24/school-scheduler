import { Router } from "express";
import teacherController from "../controllers/teachers_controller.js";

const router = Router();

router.get("/", teacherController.getAll);
router.get("/:id", teacherController.getById);
router.post("/", teacherController.create);
router.put("/:id", teacherController.update);
router.delete("/:id", teacherController.remove);

export default router;
