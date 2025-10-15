import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as authRepo from "../repositories/authRepository.js";
import { generateToken } from "../utils/token.js";

export const registerUser = async ({name, email, password, role}) => {
  const existingUser = await authRepo.findUserByEmail(email);
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  return authRepo.createUser({ name, email, password: hashedPassword, role });
};

export const loginUser = async ({email, password}) => {
  const user = await authRepo.findUserByEmail(email);
  if (!user) throw new Error("Invalid email");

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) throw new Error("Invalid password");

const token = generateToken({ id: user._id, role: user.role });
  return { token, role: user.role, name: user.name };
};

export const getAllUsers = async () => {
  const users = await authRepo.getAllUsers();
  return users;
};
