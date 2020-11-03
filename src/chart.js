import React, {useEffect, useState} from "react";
import {Card, Tabs} from 'antd';
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import axios from "axios";
import {useHistory} from "react-router";
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);
FusionCharts.options.creditLabel = false;
const { TabPane } = Tabs;

export default function Chart() {
    const [ data, setData] = useState([])
    const [key, setKey]=  useState(1)
    const [ dataSource, setDataSource ] = useState(null);
    const [ dataSource2, setDataSource2 ] = useState(null);
    const [ dataSource3, setDataSource3 ] = useState(null);
    const history = useHistory();
    const { search } = history.location;
    const kedcd = search.replace(/\D/g,'')
    console.log(history)

    const createConfig = () => {
        return {
            type: "column2d", // The chart type
            width: "100%", // Width of the chart
            height: "1000", // Height of the chart
            dataFormat: "json", // Data type

        }
    }

    const onSearch = async (type) => {
        const res = await axios.get(`process.env.API_HOST/company/finance?type=${type}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        });
        const { finances } = res.data
        console.log(finances);
        if(finances) {
            if(key === 1) {
                setDataSource({
                    chart: {
                        xAxisName: "Country",           //Set the x-axis name
                        yAxisName: "Reserves (MMbbl)",  //Set the y-axis name
                        numberSuffix: "K",
                        theme: "fusion"                 //Set the theme for your chart
                    },
                    data: finances.filter(row => {
                        return row.kedcd === kedcd
                    }).map(v => {
                        return {
                            label: v.year,
                            value: v.operatingProfit
                        }
                    })
                })
            } else if (key === 2 || key === "2") {
                setDataSource2({
                    chart: {
                        xAxisName: "Country",           //Set the x-axis name
                        yAxisName: "Reserves (MMbbl)",  //Set the y-axis name
                        numberSuffix: "K",
                        theme: "fusion"                 //Set the theme for your chart
                    },
                    data: finances.filter(row => {
                        return row.kedcd === kedcd
                    }).map(v => {
                        return {
                            label: v.year,
                            value: v['net_income']
                        }
                    })
                })
            }else
                setDataSource3({
                    chart: {
                        xAxisName: "Country",           //Set the x-axis name
                        yAxisName: "Reserves (MMbbl)",  //Set the y-axis name
                        numberSuffix: "K",
                        theme: "fusion"                 //Set the theme for your chart
                    },
                    data: finances.filter(row => {
                        return row.kedcd === kedcd
                    }).map(v => {
                        return {
                            label: v.year,
                            value: v.debt
                        }
                    })
                })
        }

    }
    useEffect(()=> {
        if(key === 1) {
            onSearch("operatingProfit")
        } else if (key === 2 || key === "2") {
            onSearch( "net_income")
        } else
            onSearch("debt")
    },[key])
    return  (
        <Card>
            <Tabs value={key} onChange={key=>setKey(key)}>
                <TabPane tab="매출" key={1}>
                    {
                        dataSource ? <ReactFC {...createConfig()} dataSource={dataSource} /> : null
                    }
                </TabPane>
                <TabPane tab="영업이익" key={2}>
                    {
                        dataSource2 ? <ReactFC {...createConfig()} dataSource={dataSource2} /> : null
                    }
                </TabPane>
                <TabPane tab="부채" key={3}>
                    {
                        dataSource3 ? <ReactFC {...createConfig()} dataSource={dataSource3} /> : null
                    }
                </TabPane>
            </Tabs>
        </Card>
    )
}
