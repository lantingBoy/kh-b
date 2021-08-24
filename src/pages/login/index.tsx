import React from 'react';
import { history } from 'umi';
import { Row, Col, Tabs ,message} from 'antd';
import LoginForm from './components/loginForm';
import styles from './index.less';
import { useState } from 'react';
import usePost from '@/hooks/usePost'
const { TabPane } = Tabs;

export interface SubmitValProps {
  username: string;
  password: string;
}

const Login = () => {

  const [type, setType] = useState<string>('LOGIN')
  const {run:fetchLogin,loading} = usePost('/api/login')
  async function handleSubmit(values: SubmitValProps) {

    const { status,currentAuthority } = await fetchLogin(values)
    if (status !== 'ok') {
      localStorage.setItem(
        'userid',
        JSON.stringify(currentAuthority.userid),
      );
      message.success('登录成功！');
      history.replace('/');
    }

  }

  const onTabChange = (value: string) => {
    setType(value)
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <div className={styles.loginRight}>
          <div className={styles.loginContent}>
            <Row>
              <Col
                span={24}
                className={styles.logo}
                style={{ textAlign: 'center' }}
              >
                <span
                  style={{ fontSize: 22, fontWeight: 600, color: '#1abc9c' }}
                >
                  数据管理平台
                </span>
              </Col>
            </Row>
              <Tabs defaultActiveKey="LOGIN" onChange={onTabChange}>
              <TabPane tab="登录" key="LOGIN"></TabPane>
              <TabPane tab="注册" key="REGISTER"></TabPane>
            </Tabs>
            <LoginForm onSubmit={handleSubmit} loginType={type} loading={loading}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login


