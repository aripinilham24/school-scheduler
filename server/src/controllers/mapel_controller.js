import * as mapelService from "../services/mapel_services.js";

export async function getAll(req, res, next) {
  try {
    const result = await mapelService.listMapel({
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
    const mapel = await mapelService.getMapelById(req.params.id);
    if (!mapel) {
      return res.status(404).json({ error: "Mapel tidak ditemukan" });
    }
    res.json({ data: mapel });
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
		console.log(`[mapel create] Creating with body:`, req.body);
		let mapel = await mapelService.createMapel(req.body);
		console.log(`[mapel create] Mapel created with ID: ${mapel.id}`);

		// If teacher is provided, assign them to the subject
		if (req.body.teacher) {
			console.log(
				`[mapel create] Teacher provided: ${req.body.teacher}, assigning...`,
			);
			try {
				mapel = await mapelService.assignTeacherToSubject(
					mapel.id,
					req.body.teacher,
				);
				console.log(`[mapel create] Teacher assignment successful`);
			} catch (assignErr) {
				console.warn("Teacher assignment warning:", assignErr.message);
				// Don't fail if assignment fails, subject is already created
			}
		} else {
			console.log(`[mapel create] No teacher provided`);
		}

		res.status(201).json({ data: mapel });
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
		let mapel = await mapelService.updateMapel(req.params.id, req.body);

		// If teacher is provided, assign them to the subject
		if (req.body.teacher) {
			try {
				mapel = await mapelService.assignTeacherToSubject(
					req.params.id,
					req.body.teacher,
				);
			} catch (assignErr) {
				console.warn("Teacher assignment warning:", assignErr.message);
				// Don't fail if assignment fails, subject is already updated
			}
		}

		res.json({ data: mapel });
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
    await mapelService.deleteMapel(req.params.id);
    res.json({ message: "Mapel berhasil dihapus" });
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
