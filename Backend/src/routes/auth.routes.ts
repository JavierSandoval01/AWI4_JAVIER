import { Router } from "express";
import { createUser, getAllUsers, getUserByUsername, login, updateTime } from "../controllers/auth.controller";
import { getTime } from "../controllers/auth.controller";
import { deleteUser } from "../controllers/auth.controller";

const router = Router();

router.post('/login-user', login);//ruta del controlador / endpoint
router.get('/getTime/:userId', getTime);
router.put('/updateTime', updateTime);
router.get('/users', getAllUsers);
router.post('/users/name', getUserByUsername);
router.post('/users', createUser);
router.delete('/users/:id', deleteUser);

export default router;