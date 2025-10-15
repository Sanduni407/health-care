export const roleAuth = (allowedRoles = []) => (req, res, next) => {
if (!req.user || !allowedRoles.includes(req.user.role)) return res.json({ success: false, message: 'Forbidden' });
next();
};