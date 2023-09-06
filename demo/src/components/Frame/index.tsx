import React, { useEffect } from 'react';
import { Layout, Menu, Breadcrumb } from '@arco-design/web-react';
import { Stack } from '../Stack';
import { pushEvent } from '@demo/utils/pushEvent';
import { githubButtonGenerate } from '@demo/utils/githubButtonGenerate';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

interface FrameProps {
  title: string;
  breadcrumb?: React.ReactElement;
  primaryAction?: React.ReactElement;
  children: React.ReactElement;
}

export default function Frame({
  children,
  title,
  primaryAction,
  breadcrumb,
}: FrameProps) {
  useEffect(() => {
    githubButtonGenerate();
  }, []);

  return (
    <Layout>
      <Header style={{ padding: '0 20px', backgroundColor: '#001529' }}>
        <Stack
          distribution='equalSpacing'
          alignment='center'
        >
          <h1 style={{ color: 'white', margin: '15px 0' }}>Easy-email</h1>
        </Stack>
      </Header>
      <Layout>
        <Stack.Item>
          <Content
            style={{
              padding: 24,
              margin: 0,
              backgroundColor: '#fff',
            }}
          >
            {children}
          </Content>
        </Stack.Item>
      </Layout>
    </Layout>
  );
}
