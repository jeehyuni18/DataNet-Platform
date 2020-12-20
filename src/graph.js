import React, {useEffect, useState} from 'react'
import 'VisualChart'
import { Chart } from "./react-visual";
import axios from "axios";
import {Button, Input} from "antd";

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
    '대기업': getRandomColor(),
    '중기업': getRandomColor(),
    '소기업': getRandomColor(),
    '중견기업': getRandomColor(),
    '보호대상중견기업': getRandomColor(),
    '판단제외': getRandomColor(),
    '소상공인': getRandomColor(),
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
        const res = await axios.get(`${process.env.REACT_APP_HOST}/node`, {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
        const { data } = res

        const nodeData = []
        console.log(data)
        const kedcdList = [];
        data.forEach(d => {

            nodeData.push({
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
        const res2 = await axios.get(`${process.env.REACT_APP_HOST}/link/${kedcdList.join("&")}`, {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
        res2.data.forEach(l => {
            nodeData.push({
                type: 'link',
                id: uuidv4(),
                id1: l.standardKedcd,
                id2: l.relation,
            })
        })

        const deleteCompanyName = async () => {
            const res = await axios.delete(`${process.env.REACT_APP_HOST}/node`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },

                data: {
                    companyName: rows.companyName

                }
            });
            const { rows } = res.data

            function setLoadData(b) {
                
            }

            setLoadData(false);
        }

        console.log(nodeData)
        setDataState(nodeData)
        if(chartState) {

        }
    }
    useEffect(() => {
        if(chartState) {
            chartState.clear();
            chartState.merge(dataState);
            chartState.layout('lens',{fit:true,spacing: 'auto'});
            chartState.options({handMode:true})
        }
    },[dataState])



    const sum = () => {
        if(chartState) {
            // dataState.forEach()
            chartState.combo().combine(
                [{ ids: ['industryName', 'addr'] }], {});
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
        console.log(value)
        setSearchValue(value)
    }

    const searchStart = async () => {
        let finalNode = [];
        console.log(searchValue)
        const res = await axios.get(`${process.env.REACT_APP_HOST}/node/${searchValue}`, {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
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
        const res2 = await axios.get(`${process.env.REACT_APP_HOST}/link/${kedcdList.join("&")}`, {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
        res2.data.forEach(d => {
            nodeIds.push(d.relation);
            finalNode.push({
                type: 'link',
                id: uuidv4(),
                id1: d.standardKedcd,
                id2: d.relation,
            })
        })


        const res3 = await axios.get(`${process.env.REACT_APP_HOST}/node/${nodeIds.join("&")}`, {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
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
            <Button> 기업규모 </Button>
            <Button> 산업분류 </Button>
            <Button onClick={sum}> Combine </Button>
            <input onChange={search}/>
            <Button onClick={searchStart}>검색</Button>
        <Chart ready={chart => setChartState(chart)} data={initData} style={{height:'1000px'}} {...chartConfig} />
        </div>
    )
}

