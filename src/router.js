import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {Menu, Layout} from 'antd';
import Board from './board'
import Chart from "./chart";
import Graph from "./graph";
import Register from "./register";

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function MyRouter() {
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider width={300}>
                    <Link to={"/"}>
                        <div style={{
                            height: '32px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            margin: '16px'
                        }} />
                    </Link>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="2" >
                            <Link to={"/board"}>
                                데이터 입력
                            </Link>
                        </Menu.Item>
                        <SubMenu title={"Data-Network Visualizaion"}>
                            <Menu.Item>
                                <Link to={"/graph"}>
                                    Data-Analytics Graph
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Switch>
                            <Route exact path="/">
                                <iframe width="100%" height="100%" src="http://gvc.effectmall.com/gvc"/>
                            </Route>
                            <Route exact path="/board">
                                <Board />
                            </Route>
                            <Route path="/chart">
                                <Chart />
                            </Route>
                            <Route path="/graph">
                                <Graph />
                            </Route>
                            <Route path="/register">
                                <Register />
                            </Route>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>jihyun_kang © 2020 Create</Footer>
                </Layout>
            </Layout>
        </Router>
    );
}
