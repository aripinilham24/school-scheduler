import * as teachersService from "../services/teachers_services.js";

export async function getAll(req, res, next) {
  try {
    const result = await teachersService.listTeachers({
      search: req.query.search,
      subject: req.query.subject,
      status: req.query.status,
    });
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const teacher = await teachersService.getTeacherById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher tidak ditemukan" });
    }
    res.json({ data: teacher });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const teacher = await teachersService.createTeacher(req.body);
    res.status(201).json({ data: teacher });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message, details: error.details || [] });
    }
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const teacher = await teachersService.updateTeacher(req.params.id, req.body);
    res.json({ data: teacher });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message, details: error.details || [] });
    }
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await teachersService.deleteTeacher(req.params.id);
    res.json({ message: "Teacher berhasil dihapus" });
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
