import React, {useEffect, useState} from 'react'
import 'VisualChart'
import { Chart } from "./react-visual";
import axios from "axios";
import {Button, Card, Input} from "antd";

const initData = {
    type: "LinkChart",
    items: [{}],
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const color = {
    '대기업': '#474ff3',
    '중기업': '#515a8d',
    '소기업': '#4fc2c6',
    '중견기업': '#3bb523',
    '보호대상중견기업': '#b8e095',
    '소상공인': '#b471c3',
    '판단제외': '#bbbbbc',
}

const size = {
    '대기업': 9,
    '중기업': 6,
    '소기업': 4,
    '중견기업': 6,
    '보호대상중견기업': 6,
    '소상공인': 3,
    '판단제외': 1,
}

export default function Graph() {
    const [ chartConfig, setChartConfig ] = useState({});
    const [ chartState, setChartState ] = useState(null);
    const [ dataState, setDataState ] = useState([]);
    const [ searchValue, setSearchValue ] = useState('');
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const loadData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_HOST}/node`);
        const { data } = res

        const nodeData = []
        const kedcdList = [];
        data.forEach(d => {
            nodeData.push({
                type: 'node',
                id: d.kedcd,
                t: d.companyName,
                c: color[d.scale],
                e: size[d.scale],
                d: {
                    industryName: d.industryName,
                    addr: d.addr
                }
            })
            kedcdList.push(d.kedcd);

        })
        const res2 = await axios.get(`${process.env.REACT_APP_API_HOST}/link/${kedcdList.join("&")}`);
        res2.data.forEach(l => {
            nodeData.push({
                type: 'link',
                id: uuidv4(),
                id1: l.standardKedcd,
                id2: l.relation,
                t: l.targetKedcd,
                fs: 100,
                a1: true,
                w: 10
            })
        })

        const deleteCompanyName = async () => {
            const res = await axios.delete(`${process.env.REACT_APP_API_HOST}/node`,{
                data: {
                    companyName: rows.companyName

                }
            });
            const { rows } = res.data

            function setLoadData(b) {
                
            }

            setLoadData(false);
        }

        setDataState(nodeData)
        if(chartState) {

        }
    }
    const chartFunction = async () => {
        await chartState.clear();
        await chartState.merge(dataState);
        await chartState.layout('lens',{fit:true,spacing: 'auto'});
        await chartState.options({handMode:true})
    }

    useEffect(() => {
        if(chartState) {
            chartFunction()
        }
    },[dataState])



    const sum = () => {
        if(chartState) {
            let check = {}
            chartState.each({type:'node'},item => {
                const industryName = item.d.industryName;
                if(check[industryName])
                    check[industryName].push(item.id);
                else
                    check[industryName] = [item.id];
            })
            const ids = Object.keys(check).map(key => {
                return {
                    ids: check[key]
                }
            })
            const matchsComboDefinitions = Object.keys(check).map((key) => {
                const fixedNode = chartState.getItem(check[key][0]);
                return {
                    ids: check[key],
                    label: fixedNode.d.industryName,
                    style: {
                        c: fixedNode.c,
                        b: fixedNode.b,
                        bw: 7,
                        fi: fixedNode.fi,
                        d: fixedNode.d,
                        e: check[key].length,
                    },
                    position: 'first',
                };
            });

            chartState.combo().combine(matchsComboDefinitions, {
                animate: true,
                time: 1500,
            }).then(res => {
                console.log(res);
            });
        }

            // chartState.graph().betweenness({}).then( (betweenness) => {
            //     const sizes = Object.keys(betweenness).map((id) => {
            //         return { id: id, e: Math.pow(1 + betweenness[id], 2) };
            //     });
            //     chartState.animateProperties(sizes, { time: 500 });
            //     chartState.layout('lens',{fit:true,spacing: 'auto'});
            // });
    }

    useEffect(() => {
        loadData()
    },[])

    const search = ({target:{value}}) => {
        setSearchValue(value)
    }

    const searchStart = async () => {
        let finalNode = [];
        const res = await axios.get(`${process.env.REACT_APP_API_HOST}/node/${searchValue}`);
        let nodeIds = [];
        let kedcdList = [];
        res.data.forEach(d => {
            finalNode.push({
                type: 'node',
                id: d.kedcd,
                t: d.companyName,
                c: color[d.scale],
                d: {
                    industryName: d.industryName,
                    addr: d.addr
                }
            })
            kedcdList.push(d.kedcd);
        })
        const res2 = await axios.get(`${process.env.REACT_APP_API_HOST}/link/${kedcdList.join("&")}`);
        res2.data.forEach(d => {
            nodeIds.push(d.relation);
            finalNode.push({
                type: 'link',
                id: uuidv4(),
                id1: d.standardKedcd,
                id2: d.relation,
                t: d.targetKedcd,
                fs: 9,
                a2: true
            })
        })


        const res3 = await axios.get(`${process.env.REACT_APP_API_HOST}/node/${nodeIds.join("&")}`);
        res3.data.forEach(d => {
            finalNode.push({
                type: 'node',
                id: d.kedcd,
                t: d.companyName,
                c: color[d.scale],
                d: {
                    industryName: d.industryName,
                    addr: d.addr
                }
            })
        })
        setDataState(finalNode);
    }

    return  (
        <div>
            <Button onClick={sum}> 산업분류 </Button>
            <input onChange={search}/>
            <Button onClick={searchStart}>검색</Button>
        <Chart ready={chart => setChartState(chart)} data={initData} style={{height:'1000px'}} {...chartConfig} />
        <Card style={{position:'absolute',bottom:'150px'}}>
            <div>
                <div style={{width: '10px', height: '10px', display: 'inline-block', background: '#474ff3', borderRadius: '5px'}}/>
                <span>대기업</span>
            </div>
            <div>
                <div style={{width: '10px', height: '10px', display: 'inline-block', background: '#515a8d', borderRadius: '5px'}}/>
                <span>중기업</span>
            </div>
            <div>
                <div style={{width: '10px', height: '10px', display: 'inline-block', background: '#4fc2c6', borderRadius: '5px'}}/>
                <span>소기업</span>
            </div>
            <div>
                <div style={{width: '10px', height: '10px', display: 'inline-block', background: '#3bb523', borderRadius: '5px'}}/>
                <span>중견기업</span>
            </div>
            <div>
                <div style={{width: '10px', height: '10px', display: 'inline-block', background: '#b8e095', borderRadius: '5px'}}/>
                <span>보호대상중견기업</span>
            </div>
            <div>
                <div style={{width: '10px', height: '10px', display: 'inline-block', background: '#b471c3', borderRadius: '5px'}}/>
                <span>소상공인</span>
            </div>
            <div>
                <div style={{width: '10px', height: '10px', display: 'inline-block', background: '#bbbbbc', borderRadius: '5px'}}/>
                <span>판단제외</span>
            </div>
        </Card>
        </div>
    )
}

