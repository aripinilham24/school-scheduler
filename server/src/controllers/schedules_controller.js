import * as schedulesService from "../services/schedules_services.js";

export async function getAll(req, res, next) {
  try {
    const result = await schedulesService.listSchedules({
      teacherId: req.query.teacherId,
      classId: req.query.classId,
      day: req.query.day,
      grade: req.query.grade,
    });
    res.json({ data: result, total: result.length });
  } catch (error) {
    next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const schedule = await schedulesService.getScheduleById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: "Jadwal tidak ditemukan" });
    }
    res.json({ data: schedule });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const schedule = await schedulesService.createSchedule(req.body);
    res.status(201).json({ data: schedule, message: "Jadwal berhasil ditambahkan" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message, details: error.details || [] });
    }
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const schedule = await schedulesService.updateSchedule(req.params.id, req.body);
    res.json({ data: schedule, message: "Jadwal berhasil diupdate" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message, details: error.details || [] });
    }
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    await schedulesService.deleteSchedule(req.params.id);
    res.json({ message: "Jadwal berhasil dihapus" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message, details: error.details || [] });
    }
    next(error);
  }
}

export async function removeAll(req, res, next) {
	try {
		const deleted = await schedulesService.deleteAllSchedules();
		res.json({ message: "Semua jadwal berhasil dihapus", deleted });
	} catch (error) {
		if (error.status) {
			return res
				.status(error.status)
				.json({ error: error.message, details: error.details || [] });
		}
		next(error);
	}
}

export async function generate(req, res, next) {
	try {
		const result = await schedulesService.generateSchedules({
			clearExisting: req.body.clearExisting ?? true,
		});
		res.json({
			message: `Jadwal berhasil dibuat: ${result.total} sesi`,
			...result,
		});
	} catch (error) {
		if (error.status) {
			return res
				.status(error.status)
				.json({ error: error.message, details: error.details || [] });
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
	removeAll,
	generate,
};
