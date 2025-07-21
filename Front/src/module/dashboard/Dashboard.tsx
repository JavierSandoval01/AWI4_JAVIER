import React from 'react'
import { Layout } from 'antd'
import { Header, Content, Footer } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'
import { Outlet } from 'react-router-dom'
import MenuComponents from '../dashboard/MenuCOmponents' // ajusta la ruta si tu archivo está en otra carpeta

function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220}>
        <MenuComponents /> 
      </Sider>

      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px 0', padding: 0, background: '#fff' }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  )
}

export default Dashboard