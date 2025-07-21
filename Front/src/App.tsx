

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './module/dashboard/Dashboard';

import UserForm from './module/user/UserForm';
import ProductTable from './module/product/Product/ProductTable';
import OrderTable from './module/order/OrderTable';
import Reportes from './module/report/Reports';
import { AuthRoutes } from './module/auth/AuthRoutes';
import Login from './module/auth/Login';

const DashboardWelcome = () => (
  <div style={{ padding: '24px' }}>
    <h1>Bienvenida al Dashboard</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
      
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas protegidas */}
        <Route element={<AuthRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardWelcome />} />
            <Route path="users" element={<UserForm />} />
            <Route path="products" element={<ProductTable />} />
            <Route path="orders" element={<OrderTable />} />
            <Route path="report" element={<Reportes />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
