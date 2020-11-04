import React, {useEffect, useState} from 'react'
import 'keylines'
import { Chart } from "./react-keylines";
import axios from "axios";

const initData = {
    type: "LinkChart",
    items: [{}],
}

export default function Graph() {
    const [ chartConfig, setChartConfig ] = useState({});
    const [ companyName, setCompanyName ] = useState('엘지');
    const loadData = async () => {
        const res = await axios.get(`http://${process.env.REACT_APP_API_HOST}:3000/api/companyName`, {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
        const { rows } = res.data
        const data = rows.map(row => {
            return {
                type: 'node',
                id: row.kedcd,
                t: row.companyName,
                c: row.color
            }
        })
        data.push({
            type: 'node',
            id: '0000000044',
            t: '엘지',
            c: 'blue'
        })
        rows.forEach((link,idx) => {
            data.push({
                id: `link${idx}`,
                id1: '0000000044',
                id2: link.kedcd,
                t: "거래처",
                fs: 9,
                type: "link",
                c: "#d4d0e7",
                fb: true,
                fbc: "#ffc3c9",
                w: 2,
                fc: "#ffffff",
                a2: false
            })
        })
        console.log(data)
        setChartConfig({
            data: {
                type: 'LinkChart',
                items: data
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
        <Chart data={initData} style={{height:'100%'}} {...chartConfig} />
    )
}

