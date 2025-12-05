'use client';

import { Form, Input, Upload, Button, Space, Image, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Product } from '../../types';
import type { UploadProps } from 'antd';

const { TextArea } = Input;

type ProductModalProps = {
  form: any;
  editingProduct: Product | null;
  uploading: boolean;
  customRequest: UploadProps['customRequest'];
  onImageChange: (value: string) => void;
};

export default function ProductModal({
  form,
  editingProduct,
  uploading,
  customRequest,
  onImageChange,
}: ProductModalProps) {
  return (
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
            onChange={(e) => {
              const value = e.target.value;
              form.setFieldValue('image', value);
              onImageChange(value);
            }}
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

      <Form.Item
        name="showOnHomepage"
        label="是否展示在主页"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren="是" unCheckedChildren="否" />
      </Form.Item>
    </Form>
  );
}

