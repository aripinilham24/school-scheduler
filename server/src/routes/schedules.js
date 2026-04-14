import express from "express";
import schedulesController from "../controllers/schedules_controller.js";

const router = express.Router();

router.get("/", schedulesController.getAll);
router.get("/:id", schedulesController.getById);
router.post("/", schedulesController.create);
router.post("/generate", schedulesController.generate);
router.put("/:id", schedulesController.update);
router.delete("/:id", schedulesController.remove);

export default router;
