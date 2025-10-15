import multer from 'multer';
import path from 'path';
import fs from 'fs';


const uploadDir = path.join(process.cwd(), 'uploads', 'doctors');
fs.mkdirSync(uploadDir, { recursive: true });


const storage = multer.diskStorage({
destination: function (req, file, cb) { cb(null, uploadDir); },
filename: function (req, file, cb) {
const ext = path.extname(file.originalname);
const name = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
cb(null, name);
}
});


const fileFilter = (req, file, cb) => {
if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files allowed'), false);
cb(null, true);
};


const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB


export default upload;