import { Request, Response } from "express";
import { generateAccessToken } from "../utils/generateToken";
import { cache } from "../utils/cache";
import dayjs from "dayjs";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const login = (req:Request, res:Response) =>{
    // name: stting asigno tipo de variable
    // name="michel" asigno valor
    let name: string = "Michel";

    const {username, password} = req.body;
    //Validacion de credenciales
    if(username !== "Admin" || password !=='123456789'){
        return res.status(401)
        .json ({message: "Credenciales incorrectas"})
    }
    const userId = 'abc123';

    const accessToken = generateAccessToken(userId);

    cache.set(userId, accessToken,60*15);

return res.json({
    message:'Login',
    accessToken})
}

export const getTime=(req:Request, res:Response)=>{
    const {userId}=req.params;
    const ttl = cache.getTtl(userId);

    if(!ttl){
        return res.status(404).json ({message: "Token no encontrado"})
    }

    const now=Date.now();
    const tiemToLifeSeconds=Math.floor((ttl-now)/1000);
    const expTime=dayjs(ttl).format('HH:mm:ss');

    return res.json({
        tiemToLifeSeconds,
        expTime
    })

}

export const updateTime = (req: Request, res: Response) => {
  const { userId } = req.body;

  const ttl = cache.getTtl(userId);
  if (!ttl) {
    return res.status(404).json({ message: 'Token no encontrado o expirado' });
  }

  const nuevaTTLsegundos = 60 * 15; // 10 minutos
  cache.ttl(userId, nuevaTTLsegundos);

  res.json({ message: "Actualizado con éxito" });
};


export const getAllUsers = async (req:Request, res:Response)=>{
    const userList= await User.find();

    return res.json({userList});
}

export const getUserByUsername = async (req: Request, res: Response) => {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: "Usuario no existe" });
    }

    return res.json({ user });
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndUpdate(
            id,
            { status: false, deleteDate: new Date() },
            { new: true }
        );

        if (!deletedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.json({
            message: "Usuario eliminado (lógicamente)",
            user: deletedUser
        });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};



export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, email, role } = req.body;

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            email,
            status: true
        });

        const user = await newUser.save();
        return res.json({ user });

    } catch (error) {
        console.log("Error ocurrido en createUser:", error);
        return res.status(500).json({ error: "Error al crear el usuario" });
    }
};