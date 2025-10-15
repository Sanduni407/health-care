import User from "../models/userModel.js";

export const createUser = (userData) => new User(userData).save();
export const findUserByEmail = (email) => User.findOne({ email });
export const findUserById = (id) => User.findById(id);
export const getAllUsers = () => User.find({}, "-password").sort({ createdAt: -1 });
