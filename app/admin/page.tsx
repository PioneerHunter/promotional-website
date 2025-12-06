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
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, CloudUploadOutlined, SearchOutlined, ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import type { Product } from '../types';
import type { UploadFile, UploadProps } from 'antd';
import ProductModal from './components/ProductModal';

const { TextArea } = Input;

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [gitPushing, setGitPushing] = useState(false);

  // 搜索条件状态（用于过滤）
  const [searchFilters, setSearchFilters] = useState<{
    title: string;
    description: string;
    category: string;
  }>({
    title: '',
    description: '',
    category: '',
  });

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
      showOnHomepage: product.showOnHomepage ?? true, // 默认值为 true
    });
    setIsModalOpen(true);
  };

  // 打开添加模态框
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({ showOnHomepage: true }); // 默认显示在主页
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

  // Git 推送功能
  const handleGitPush = async () => {
    try {
      setGitPushing(true);
      const response = await fetch('/api/git/push', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        message.success('代码已成功推送到远程仓库！');
      } else {
        message.error(data.error || '推送失败');
      }
    } catch (error) {
      console.error('Git 推送错误:', error);
      message.error('推送失败，请检查网络连接');
    } finally {
      setGitPushing(false);
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

  // 处理搜索
  const handleSearch = (values: { title?: string; description?: string; category?: string }) => {
    setSearchFilters({
      title: values.title || '',
      description: values.description || '',
      category: values.category || '',
    });
  };

  // 处理重置
  const handleReset = () => {
    searchForm.resetFields();
    setSearchFilters({
      title: '',
      description: '',
      category: '',
    });
  };

  // 过滤产品列表
  const filteredProducts = products.filter((product) => {
    // 标题搜索
    const matchTitle = !searchFilters.title ||
      product.title.toLowerCase().includes(searchFilters.title.toLowerCase());

    // 描述搜索
    const matchDescription = !searchFilters.description ||
      product.description.toLowerCase().includes(searchFilters.description.toLowerCase());

    // 分类搜索
    const matchCategory = !searchFilters.category ||
      product.categories.some((cat) =>
        cat.toLowerCase().includes(searchFilters.category.toLowerCase())
      );

    return matchTitle && matchDescription && matchCategory;
  });

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
      title: '展示在主页',
      dataIndex: 'showOnHomepage',
      key: 'showOnHomepage',
      width: 120,
      render: (show: boolean | undefined) => (
        <Tag color={show !== false ? 'green' : 'default'}>
          {show !== false ? '是' : '否'}
        </Tag>
      ),
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/">
              <Button
                icon={<ArrowLeftOutlined />}
                size="large"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                返回
              </Button>
            </Link>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>产品管理</h1>
          </div>
          <Space size="middle">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAdd}
              style={{
                fontWeight: 500,
              }}
            >
              添加产品
            </Button>
            <Popconfirm
              title="确定要推送代码到远程仓库吗？"
              onConfirm={handleGitPush}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="default"
                icon={<CloudUploadOutlined />}
                size="large"
                loading={gitPushing}
                style={{
                  borderColor: '#d9d9d9',
                }}
              >
                上传
              </Button>
            </Popconfirm>
          </Space>
        </div>

        {/* 搜索表单 */}
        <div style={{
          marginBottom: '16px',
          padding: '16px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
            style={{ width: '100%' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              width: '100%',
              marginBottom: '16px'
            }}>
              <Form.Item name="title" style={{ margin: 0, width: '100%' }}>
                <Input
                  placeholder="按标题搜索"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="description" style={{ margin: 0, width: '100%' }}>
                <Input
                  placeholder="按描述搜索"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
              <Form.Item name="category" style={{ margin: 0, width: '100%' }}>
                <Input
                  placeholder="按分类搜索"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', width: '100%' }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                搜索
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </div>
          </Form>
          {(searchFilters.title || searchFilters.description || searchFilters.category) && (
            <div style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
              找到 {filteredProducts.length} 个匹配的产品
            </div>
          )}
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条${(searchFilters.title || searchFilters.description || searchFilters.category) ? `（已过滤）` : ''}`,
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
          <ProductModal
            form={form}
            editingProduct={editingProduct}
            uploading={uploading}
            customRequest={customRequest}
            onImageChange={(value) => form.setFieldValue('image', value)}
          />
        </Modal>
      </div>
    </div>
  );
}
