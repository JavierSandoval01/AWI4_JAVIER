import React, { useState } from 'react';
import {
  Table,
  Tag,
  Input,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;

interface Product {
  key: string;
  name: string;
  price: number;
  qty: number;
  status: boolean;
}

const initialProducts: Product[] = [
  {
    key: '1',
    name: 'Laptop HP',
    price: 1200,
    qty: 10,
    status: true,
  },
  {
    key: '2',
    name: 'Teclado Mecánico',
    price: 75,
    qty: 25,
    status: true,
  },
  {
    key: '3',
    name: 'Mouse Inalámbrico',
    price: 35,
    qty: 0,
    status: false,
  },
];

const ProductTable: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const handleDelete = (key: string) => {
    setProducts((prev) => prev.filter((p) => p.key !== key));
    message.success('Producto eliminado correctamente');
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue({ ...record, status: record.status ? 'true' : 'false' });
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newProduct: Product = {
        key: editingProduct ? editingProduct.key : Date.now().toString(),
        name: values.name,
        price: values.price,
        qty: values.qty,
        status: values.status === 'true',
      };

      if (editingProduct) {
        setProducts((prev) =>
          prev.map((item) => (item.key === editingProduct.key ? newProduct : item))
        );
        message.success('Producto modificado correctamente');
      } else {
        setProducts((prev) => [...prev, newProduct]);
        message.success('Producto agregado correctamente');
      }

      setIsModalVisible(false);
    });
  };

  const filteredData = products.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Product> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Cantidad',
      dataIndex: 'qty',
      key: 'qty',
      sorter: (a, b) => a.qty - b.qty,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? 'Disponible' : 'No disponible'}
        </Tag>
      ),
      sorter: (a, b) => Number(b.status) - Number(a.status),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary" onClick={() => handleEdit(record)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este producto?"
            onConfirm={() => handleDelete(record.key)}
            okText="Sí"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Productos</h2>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Buscar producto"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Agregar Producto
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredData} />

      <Modal
        title={editingProduct ? 'Editar Producto' : 'Agregar Producto'}
        open={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              { required: true, message: 'El nombre es obligatorio' },
              { min: 3, message: 'El nombre debe tener al menos 3 caracteres' },
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
            name="price"
            label="Precio"
            rules={[
              { required: true, message: 'El precio es obligatorio' },
              {
                type: 'number',
                min: 0.01,
                message: 'El precio debe ser mayor a 0',
              },
            ]}
          >
            <InputNumber min={0.01} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="qty"
            label="Cantidad"
            rules={[
              { required: true, message: 'La cantidad es obligatoria' },
              {
                type: 'number',
                min: 0,
                message: 'La cantidad no puede ser negativa',
              },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Estado"
            rules={[{ required: true, message: 'Selecciona el estado del producto' }]}
          >
            <Select placeholder="Selecciona un estado">
              <Option value="true">Disponible</Option>
              <Option value="false">No disponible</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductTable;
