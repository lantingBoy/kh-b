import React, { FC } from 'react';
import { Form, Input, Button,  } from 'antd';
import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { SubmitValProps } from '../../index';

const formItemLayout = {
  wrapperCol: { span: 24 },
};

interface LoginFormProps {
  loading: boolean;
  loginType: string
}

interface ParentProps {
  onSubmit: (key: SubmitValProps) => void;
}

const LoginForm: FC<LoginFormProps & ParentProps> = ({
  onSubmit,
  loading,
  loginType
}) => {

  const buttonText = loginType ==='LOGIN'? '登录' :'注册'
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
    onSubmit(values);
  };

  const handleChange = () => {

  };

  return (
    <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: '请输入手机号',
          },
          {
            pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
            message:'请输入正确的手机号码'
          }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          onChange={handleChange}
          maxLength={11}
          placeholder="请输入手机号码"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码最少6位数' },
          { max: 18, message: '密码最多18位数' },
          {
            pattern: new RegExp('^\\w+$', 'g'),
            message: '账号必须字母或数字',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          autoComplete="off"
          onChange={handleChange}
          placeholder="请输入密码"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: '100%' }}
        >
          {loading ? `${buttonText}中...` : buttonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm
