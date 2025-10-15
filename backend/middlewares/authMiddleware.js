import { verifyToken } from "../utils/token.js";
import * as authRepo from "../repositories/authRepository.js";

export const userAuth = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.json({ success: false, message: "Not authorized" });

  try {
     const decoded = verifyToken(token); 
    const user = await authRepo.findUserById(decoded.id);
    if (!user) throw new Error("User not found");
    

    req.user = { id: user._id, role: user.role, name: user.name };
    next();
  } catch (err) {
    res.json({ success: false, message: "Invalid token" });
  }
};
