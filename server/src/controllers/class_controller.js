import * as classService from "../services/class_services.js";

export async function getAll(req, res, next) {
	try {
		const result = await classService.listClasses({
			search: req.query.search,
			level: req.query.level,
			status: req.query.status,
		});
		res.json({ data: result });
	} catch (error) {
		next(error);
	}
}

export async function getById(req, res, next) {
	try {
		const classData = await classService.getClassById(req.params.id);
		if (!classData) {
			return res.status(404).json({ error: "Class tidak ditemukan" });
		}
		res.json({ data: classData });
	} catch (error) {
		next(error);
	}
}

export async function create(req, res, next) {
	try {
		const classData = await classService.createClass(req.body);
		res.status(201).json({ data: classData });
	} catch (error) {
		if (error.status) {
			return res
				.status(error.status)
				.json({ error: error.message, details: error.details || [] });
		}
		next(error);
	}
}

export async function update(req, res, next) {
	try {
		const classData = await classService.updateClass(req.params.id, req.body);
		res.json({ data: classData });
	} catch (error) {
		if (error.status) {
			return res
				.status(error.status)
				.json({ error: error.message, details: error.details || [] });
		}
		next(error);
	}
}

export async function remove(req, res, next) {
	try {
		await classService.deleteClass(req.params.id);
		res.json({ message: "Class berhasil dihapus" });
	} catch (error) {
		if (error.status) {
			return res.status(error.status).json({ error: error.message });
		}
		next(error);
	}
}

export default {
	getAll,
	getById,
	create,
	update,
	remove,
};
