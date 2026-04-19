import express from "express";
import * as classroomService from "../services/classroom_services.js";

const router = express.Router();

// GET all classrooms
router.get("/", async (req, res, next) => {
	try {
		const classrooms = await classroomService.listClassrooms();
		res.json(classrooms);
	} catch (error) {
		next(error);
	}
});

// GET classroom by ID
router.get("/:id", async (req, res, next) => {
	try {
		const classroom = await classroomService.getClassroomById(req.params.id);
		if (!classroom) {
			return res.status(404).json({ error: "Kelas tidak ditemukan" });
		}
		res.json(classroom);
	} catch (error) {
		next(error);
	}
});

// POST new classroom
router.post("/", async (req, res, next) => {
	try {
		const classroom = await classroomService.createClassroom(req.body);
		res.status(201).json(classroom);
	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ error: error.message });
		}
		next(error);
	}
});

// PUT update classroom
router.put("/:id", async (req, res, next) => {
	try {
		const classroom = await classroomService.updateClassroom(req.params.id, req.body);
		res.json(classroom);
	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ error: error.message });
		}
		next(error);
	}
});

// DELETE classroom
router.delete("/:id", async (req, res, next) => {
	try {
		await classroomService.deleteClassroom(req.params.id);
		res.json({ message: "Kelas berhasil dihapus" });
	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ error: error.message });
		}
		next(error);
	}
});

export default router;
