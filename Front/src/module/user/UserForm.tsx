import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Table,
  Space,
  Modal,
  Popconfirm,
  message,
  Select,
} from 'antd';

const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export default function UserSection() {
  const [view, setView] = useState<'form' | 'table'>('form');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Administrador" },
    { id: 2, name: "Ana López", email: "ana@example.com", role: "Editor" },
    { id: 3, name: "Carlos Ruiz", email: "carlos@example.com", role: "Lector" }
  ]);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Agregar nuevo usuario
  const onFinish = (values: any) => {
    const newUser: User = {
      id: Date.now(),
      name: values.username,
      email: values.email,
      role: values.role,
      password: values.password,
    };
    setUsers(prev => [...prev, newUser]);
    message.success('Usuario registrado correctamente');
    form.resetFields();
  };

  // Editar usuario
  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.name,
      email: user.email,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  const handleSaveEdit = () => {
    form.validateFields().then(values => {
      const updated = users.map(u =>
        u.id === editingUser?.id
          ? { ...u, name: values.username, email: values.email, role: values.role }
          : u
      );
      setUsers(updated);
      message.success('Usuario editado correctamente');
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    });
  };

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    message.success('Usuario eliminado correctamente');
  };

  const filteredData = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => a.email.localeCompare(b.email)
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button size="small" type="primary" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que deseas eliminar este usuario?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button size="small" danger>
              Borrar
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Usuarios</h2>
      <Space style={{ marginBottom: 24 }}>
        <Button onClick={() => setView('form')} type={view === 'form' ? 'primary' : 'default'}>
          Formulario
        </Button>
        <Button onClick={() => setView('table')} type={view === 'table' ? 'primary' : 'default'}>
          Tabla
        </Button>
      </Space>

      {view === 'form' ? (
        <Form
          form={form}
          name="userForm"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre de usuario' }]}
          >
            <Input placeholder="Nombre de usuario" />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu email' },
              { type: 'email', message: 'Ingresa un email válido' }
            ]}
          >
            <Input placeholder="Correo electrónico" />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: 'Por favor ingresa una contraseña' },
              { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            ]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>

          <Form.Item
            label="Rol"
            name="role"
            rules={[{ required: true, message: 'Por favor selecciona un rol' }]}
          >
            <Select placeholder="Selecciona un rol">
              <Option value="Administrador">Administrador</Option>
              <Option value="Editor">Editor</Option>
              <Option value="Lector">Lector</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Registrar
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <>
          <Input.Search
            placeholder="Buscar por nombre"
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 16, maxWidth: 300 }}
            allowClear
          />
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            rowKey="id"
          />
        </>
      )}

      {/* Modal para editar usuario */}
      <Modal
        title="Editar Usuario"
        open={isModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa el email' },
              { type: 'email', message: 'Ingresa un email válido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Rol"
            name="role"
            rules={[{ required: true, message: 'Selecciona un rol' }]}
          >
            <Select placeholder="Selecciona un rol">
              <Option value="Administrador">Administrador</Option>
              <Option value="Editor">Editor</Option>
              <Option value="Lector">Lector</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
