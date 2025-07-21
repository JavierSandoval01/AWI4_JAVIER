import { Request, Response } from 'express';
import { Menu } from '../models/Menu';

export const getMenus = async (req: Request, res: Response) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener menús', error });
  }
};

export const createMenu = async (req: Request, res: Response) => {
  try {
    const { title, path, icon, roles } = req.body;

    const newMenu = new Menu({
      title,
      path,
      icon,
      roles
    });

    const savedMenu = await newMenu.save();
    res.status(201).json(savedMenu);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear menú', error });
  }
};