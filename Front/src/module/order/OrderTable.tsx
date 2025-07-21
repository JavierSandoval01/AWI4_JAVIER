import React, { useState } from 'react';
import {
  Table,
  Tag,
  Input,
  Button,
  Space,
  message,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Search } = Input;
const { Option } = Select;

interface Order {
  key: string;
  user: string;
  status: string;
  subtotal: number;
  total: number;
  createDate: string;
}

const initialOrders: Order[] = [
  {
    key: '1',
    user: 'Juan Pérez',
    status: 'Pagado',
    subtotal: 150,
    total: 165,
    createDate: '2024-06-01',
  },
  {
    key: '2',
    user: 'Ana López',
    status: 'Pendiente',
    subtotal: 300,
    total: 330,
    createDate: '2024-06-10',
  },
  {
    key: '3',
    user: 'Carlos Ruiz',
    status: 'Cancelado',
    subtotal: 200,
    total: 200,
    createDate: '2024-06-15',
  },
];

const OrderTable: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  const handleDelete = (key: string) => {
    setOrders((prev) => prev.filter(order => order.key !== key));
    message.success('Orden eliminada exitosamente');
  };

  const handleEdit = (record: Order) => {
    setEditingOrder(record);
    form.setFieldsValue({
      ...record,
      createDate: dayjs(record.createDate),
    });
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then(values => {
        const formattedOrder: Order = {
          ...values,
          key: editingOrder ? editingOrder.key : Date.now().toString(),
          createDate: values.createDate.format('YYYY-MM-DD'),
        };

        if (editingOrder) {
          setOrders(prev =>
            prev.map(order =>
              order.key === editingOrder.key ? formattedOrder : order
            )
          );
          message.success('Orden modificada exitosamente');
        } else {
          setOrders(prev => [...prev, formattedOrder]);
          message.success('Orden agregada exitosamente');
        }

        setIsModalVisible(false);
      })
      .catch(info => {
        console.error('Validación fallida:', info);
      });
  };

  const filteredData = orders.filter((item) =>
    item.user.toLowerCase().includes(searchText.toLowerCase()) ||
    item.status.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Order> = [
    {
      title: 'Usuario',
      dataIndex: 'user',
      key: 'user',
      sorter: (a, b) => a.user.localeCompare(b.user),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color =
          status === 'Pagado' ? 'green' : status === 'Pendiente' ? 'orange' : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      sorter: (a, b) => a.subtotal - b.subtotal,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'createDate',
      key: 'createDate',
      sorter: (a, b) =>
        new Date(a.createDate).getTime() - new Date(b.createDate).getTime(),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="primary"
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar esta orden?"
            onConfirm={() => handleDelete(record.key)}
            okText="Sí"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Órdenes</h2>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Buscar por usuario o estado"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Agregar Orden
        </Button>
      </Space>
      <Table columns={columns} dataSource={filteredData} />

      <Modal
        title={editingOrder ? "Editar Orden" : "Agregar Orden"}
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="user"
            label="Usuario"
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { min: 3, message: 'Debe tener al menos 3 caracteres' },
              {
                validator: (_, value) =>
                  value && value.trim() !== ''
                    ? Promise.resolve()
                    : Promise.reject('El nombre no puede estar vacío'),
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Selecciona el estado' }]}
          >
            <Select placeholder="Selecciona un estado">
              <Option value="Pagado">Pagado</Option>
              <Option value="Pendiente">Pendiente</Option>
              <Option value="Cancelado">Cancelado</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="subtotal"
            label="Subtotal"
            rules={[
              { required: true, message: 'El subtotal es obligatorio' },
              { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="total"
            label="Total"
            rules={[
              { required: true, message: 'El total es obligatorio' },
              { type: 'number', min: 0, message: 'Debe ser mayor o igual a 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="createDate"
            label="Fecha de creación"
            rules={[{ required: true, message: 'La fecha es obligatoria' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderTable;
