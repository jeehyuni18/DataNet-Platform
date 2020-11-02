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

const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;

export default function MyRouter(props) {
    console.log(props)
    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider width={300}>
                    <div style={{
                        height: '32px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        margin: '16px'
                    }} />
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
                            <Menu.Item>
                                <Link to={"/chart"}>
                                    Data-Analytics Chart
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }} />
                    <Content style={{ margin: '0 16px' }}>
                        <Switch>
                            <Route exact path="/board">
                                <Board />
                            </Route>
                            <Route path="/chart">
                                <Chart />
                            </Route>
                            <Route path="/graph">
                                <Graph />
                            </Route>
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        </Router>
    );
}
