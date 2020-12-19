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
                <Header className="site-layout-background" style={{ padding: 0 }} >
                    <div style={{color:'#fff',textAlign:'center',fontSize:'30px',fontWeight:'500'}}>
                        DATANETWORK PLATFORM
                    </div>
                </Header>
                <Layout>
                    <Sider width={300}>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" >
                                <Link to={"/board"}>
                                    Main
                                </Link>
                            </Menu.Item>
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
                        <Content style={{ margin: '0 16px' }}>
                            <Switch>
                                <Route exact path="/">
                                    <iframe width="100%" height="100%" src="http://network.effectmall.com/gvc"/>
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
            </Layout>
        </Router>
    );
}
