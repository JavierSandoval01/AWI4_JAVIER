

import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; // Ajusta esta ruta según tu proyecto

const Icons = {
  DashboardOutlined,
  UserOutlined,
  BarChartOutlined,
};

const fakeMenuData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: "DashboardOutlined",
    roles: ["admin"]
  },
  {
    title: "Usuarios",
    path: "/dashboard/users",
    icon: "UserOutlined",
    roles: ["admin"]
  },
  {
    title: "Productos",
    path: "/dashboard/products",
    icon: "BarChartOutlined",
    roles: ["admin"]
  },
  {
    title: "Órdenes",
    path: "/dashboard/orders",
    icon: "BarChartOutlined",
    roles: ["admin"]
  },
  {
    title: "Reportes",
    path: "/dashboard/report",
    icon: "BarChartOutlined",
    roles: ["admin"]
  }
  
];

export default function MenuComponent() {
  const [menuItems, setMenuItems] = useState<MenuProps['items']>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    const items: MenuProps['items'] = fakeMenuData.map((item) => {
      const IconComponent = Icons[item.icon as keyof typeof Icons];
      return {
        key: item.path,
        icon: IconComponent ? <IconComponent /> : null,
        label: item.title,
      };
    });

    // Agregar al final la opción de cerrar sesión
    items.push({
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
    });

    setMenuItems(items);
  }, []);

  const handleClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();               // limpia el token
      navigate('/login');     // redirige al login
    } else {
      navigate(key);
    }
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={handleClick}
      items={menuItems}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
}
