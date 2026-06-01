import * as authService from "../services/auth_services.js";

export async function register(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const user = await authService.registerUser({ email, password, name });
    res.status(201).json({ data: user });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    res.json({ data: result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await authService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Token tidak valid" });
    }

    const user = await authService.getUserById(decoded.uid);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export default { register, login, me };
