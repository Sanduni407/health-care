import * as authService from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.json({ success: true, user });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const data = await authService.loginUser(req.body);
    res.json({ success: true, ...data });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await authService.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
