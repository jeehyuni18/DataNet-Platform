import React, {useEffect, useState} from 'react'
import 'VisualChart'
import { Chart } from "./react-visual";
import axios from "axios";
import {Button} from "antd";

const initData = {
    type: "LinkChart",
    items: [{}],
}



export default function Graph() {
    const [ chartConfig, setChartConfig ] = useState({});
    const [ companyName, setCompanyName ] = useState('엘지');
    const loadData = async () => {
        const res = await axios.get(`${process.env.REACT_APP_HOST}/node`, {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
        const { data } = res

        const nodedata = data.map(row => {
            return {
                type: 'node',
                id: row.kedcd,
                t: row.companyName,
                c: row.color
            }
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


        // nodedata.push({
        //     type: 'node',
        //     id: '0000000044',
        //     t: '엘지',
        //     c: 'blue'
        // })
        // data.forEach((link,idx) => {
        //     nodedata.push({
        //         id: `link${idx}`,
        //         id1: '0000000044',
        //         id2: link.kedcd,
        //         t: "거래처",
        //         fs: 9,
        //         type: "link",
        //         c: "#d4d0e7",
        //         fb: true,
        //         fbc: "#ffc3c9",
        //         w: 2,
        //         fc: "#ffffff",
        //         a2: false
        //     })
        // })
        console.log(nodedata)
        setChartConfig({
            data: {
                type: 'LinkChart',
                items: nodedata
            },
            options: {
                handMode: true,
            }
        })
    }
    useEffect(() => {
        loadData()
    },[])
    return  (
        <div>
            <Button> 기업규모 </Button>
            <Button> 산업분류 </Button>
            <Button> Combine </Button>
        <Chart data={initData} style={{height:'1000px'}} {...chartConfig} />
        </div>
    )
}

