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
    const loadData = async () => {
        const res = await axios.get('http://localhost:3020/api/company', {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
        const { rows } = res.data

        const data = rows.map(row => {
            return {
                type: 'node',
                id: row.kedcd,
                t: row.companyName,
                c: 'blue'
            }
        })
        const linkRes = await axios.get('http://localhost:3020/api/company/link', {headers: {
                'Access-Control-Allow-Origin': '*',
            }});
        const { links } = linkRes.data
        links.forEach((link,idx) => {
            data.push({
                id: `link${idx}`,
                id1: link.standardKedcd,
                id2: link.targetkedcd,
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

