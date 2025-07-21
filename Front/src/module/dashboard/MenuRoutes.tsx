import { type JSX } from 'react';
import UserForm from '../user/UserForm';
import ProductTable from '../product/Product/ProductTable';
import OrderTable from '../order/OrderTable';

export interface MenuRoute {
  path: string;
  element: JSX.Element;
  label: string;
}

const routes: MenuRoute[] = [
  {
    path: '/dashboard',
    element: <p>Dashboard</p>,
    label: 'dashboard',
  },
  {
    path: '/users',
    element: <UserForm />,
    label: 'Usuarios',
  },
  {
    path: '/products',
    element: <ProductTable />,
    label: 'Productos',
  },
  {
    path: '/orders',
    element: <OrderTable />,
    label: 'Órdenes',
  },
];

export default routes;