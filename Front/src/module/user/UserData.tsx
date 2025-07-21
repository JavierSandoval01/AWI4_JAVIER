import { Button, Input, Table, Space, Modal, Form, Select, message } from "antd";
import { useState } from "react";

const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string; // sólo para registrar
}

export default function UseData() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Administrador", password: "123456" },
    { id: 2, name: "Ana López", email: "ana@example.com", role: "Usuario", password: "abcdef" },
    { id: 3, name: "Carlos Ruiz", email: "carlos@example.com", role: "Invitado", password: "qwerty" }
  ]);

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredData = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const showModal = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      name: record.name,
      email: record.email,
      role: record.role
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    message.success('Usuario eliminado');
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingUser) {
        // Actualizar sin tocar contraseña
        const updated = users.map(u =>
          u.id === editingUser.id ? { ...u, name: values.name, email: values.email, role: values.role } : u
        );
        setUsers(updated);
        message.success('Usuario actualizado');
      } else {
        // Agregar con contraseña
        const newUser: User = {
          id: Date.now(),
          name: values.name,
          email: values.email,
          role: values.role,
          password: values.password
        };
        setUsers(prev => [...prev, newUser]);
        message.success('Usuario agregado');
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

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
      filters: [
        { text: 'Administrador', value: 'Administrador' },
        { text: 'Usuario', value: 'Usuario' },
        { text: 'Invitado', value: 'Invitado' }
      ],
      onFilter: (value: any, record: any) => record.role === value
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button size="small" type="primary" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Button size="small" danger onClick={() => handleDelete(record.id)}>
            Borrar
          </Button>
        </Space>
      ),
    }
  ];

  return (
    <div className="p-4">
      <Space className="mb-4">
        <Input.Search
          placeholder="Buscar"
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
        <Button type="primary" onClick={showModal}>
          Agregar usuario
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />

      <Modal
        title={editingUser ? "Editar usuario" : "Agregar usuario"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingUser ? "Guardar" : "Registrar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: 'Nombre obligatorio' },
              { min: 3, message: 'Mínimo 3 caracteres' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Email obligatorio' },
              { type: 'email', message: 'Formato de email no válido' }
            ]}
          >
            <Input />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Contraseña"
              name="password"
              rules={[
                { required: true, message: 'Contraseña obligatoria' },
                { min: 6, message: 'Mínimo 6 caracteres' }
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            label="Rol"
            name="role"
            rules={[{ required: true, message: 'Selecciona un rol' }]}
          >
            <Select placeholder="Selecciona un rol">
              <Option value="Administrador">Administrador</Option>
              <Option value="Usuario">Usuario</Option>
              <Option value="Invitado">Invitado</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
