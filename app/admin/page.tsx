'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
  Tag,
  Image,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { Product } from '../types';
import type { UploadFile, UploadProps } from 'antd';

const { TextArea } = Input;

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  // 获取产品列表
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('获取产品列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 删除产品
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          message.success('删除成功');
          fetchProducts();
        } else {
          const error = await response.json();
          message.error(`删除失败: ${error.error || '未知错误'}`);
        }
      } else {
        const error = await response.json();
        message.error(`删除失败: ${error.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('删除失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 编辑产品
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      ...product,
      categories: product.categories.join(', '),
    });
    setIsModalOpen(true);
  };

  // 打开添加模态框
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  // 上传图片
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.url) {
      return data.url;
    } else {
      throw new Error(data.error || '上传失败');
    }
  };

  // 自定义上传
  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      setUploading(true);
      const url = await handleImageUpload(file as File);
      form.setFieldValue('image', url);
      message.success('图片上传成功');
      onSuccess?.(url);
    } catch (error) {
      message.error('图片上传失败');
      onError?.(error as Error);
    } finally {
      setUploading(false);
    }
  };

  // 保存产品
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const categories = values.categories
        ? values.categories.split(',').map((c: string) => c.trim()).filter((c: string) => c)
        : [];

      const productData = {
        ...values,
        categories,
      };

      const method = editingProduct ? 'PUT' : 'POST';
      const endpoint = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        message.success(editingProduct ? '更新成功' : '添加成功');
        fetchProducts();
        handleCancel();
      } else {
        const error = await response.json();
        message.error(`保存失败: ${error.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('保存失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image: string) => (
        <Image
          src={image}
          alt="产品图片"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
          fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E无图片%3C/text%3E%3C/svg%3E"
        />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 300,
    },
    {
      title: '分类',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <Space wrap>
          {categories.map((category, index) => (
            <Tag key={index} color="orange">
              {category}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      ellipsis: true,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: '图片路径',
      dataIndex: 'image',
      key: 'imagePath',
      ellipsis: true,
      width: 200,
      render: (image: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{image}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个产品吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>产品管理</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={handleAdd}
          >
            添加产品
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1200 }}
        />

        <Modal
          title={editingProduct ? '编辑产品' : '添加产品'}
          open={isModalOpen}
          onOk={handleSave}
          onCancel={handleCancel}
          width={800}
          confirmLoading={uploading}
          okText="保存"
          cancelText="取消"
        >
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: '24px' }}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入产品标题" />
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
              rules={[{ required: true, message: '请输入描述' }]}
            >
              <TextArea
                rows={4}
                placeholder="请输入产品描述"
              />
            </Form.Item>

            <Form.Item
              name="image"
              label="图片"
              rules={[{ required: true, message: '请上传图片或输入图片路径' }]}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Upload
                  customRequest={customRequest}
                  showUploadList={false}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    上传图片
                  </Button>
                </Upload>
                <Input
                  placeholder="或输入图片路径（如：/products/product1.jpg）"
                  onChange={(e) => form.setFieldValue('image', e.target.value)}
                />
                {form.getFieldValue('image') && (
                  <div>
                    <Image
                      src={form.getFieldValue('image')}
                      alt="预览"
                      width={200}
                      height={150}
                      style={{ objectFit: 'cover', marginTop: '8px' }}
                      fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='200' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E无图片%3C/text%3E%3C/svg%3E"
                    />
                    <p style={{ marginTop: '8px', fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>
                      图片路径: {form.getFieldValue('image')}
                    </p>
                  </div>
                )}
              </Space>
            </Form.Item>

            <Form.Item
              name="date"
              label="日期"
            >
              <Input placeholder="如：7月 26, 2023" />
            </Form.Item>

            <Form.Item
              name="categories"
              label="分类（用逗号分隔）"
            >
              <Input placeholder="基本护理, 博客" />
            </Form.Item>

            <Form.Item
              name="brand"
              label="品牌"
            >
              <Input placeholder="请输入品牌名称" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
