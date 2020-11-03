import React, {useEffect, useState} from 'react'
import {Input, Button, Table, Row} from 'antd';
import axios from 'axios';
import {Link} from "react-router-dom";
import { useHistory } from "react-router";
const { Search } = Input;

export default function Board() {
    const history = useHistory();
    console.log(history)
    const [ data, setData] = useState([]);
    const [ rowKey, setRowKey ] = useState('')
    const [ loadData, setLoadData ] = useState(false)
    const [ companyName, setCompanyName ] = useState('');
    const columns = [
        {
            title: 'kedcd',
            dataIndex: 'kedcd'
        },
        {
            title: '기업명',
            dataIndex: 'companyName',
        },
        {
            title: '업종',
            dataIndex: 'industryName',
        },
        {
            title: '사업자등록번호',
            dataIndex: 'businessNum',
        },
        {
            title: '산업분야',
            dataIndex: 'product',

        },
        {
            title: '기업규모',
            dataIndex: 'scale',

        }
    ];


    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowKey(selectedRowKeys)
        },
        type: 'radio'
    };

    useEffect(() => {
        const loadDatas = async () => {
           const res = await axios.get('process.env.API_HOST/api/company', {
               headers: {
                   'Access-Control-Allow-Origin': '*',
               }});
           const { rows } = res.data
           setData((rows))
        }
        if(!loadData) {
            loadDatas()
            setLoadData(true);
        }
    },[loadData])

    const addData = async () => {
        const res = await axios.post('process.env.API_HOST/api/company', {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                test: 1
            }
        });
    }

    const deleteCompany = async () => {
        const res = await axios.delete('process.env.API_HOST/api/company', {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                kedcd: rowKey
            }
        });
        setLoadData(false);
    }

    const onSearch = async () => {
        const res = await axios.get(`process.env.API_HOST/api/company/search?companyName=${companyName}`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        });
        const { rows } = res.data
        setData((rows))
    }

    return  (
            <div>
                <Row style={{marginTop: 16}}>
                    <Button type="primary" style={{ marginBottom: 16, marginRight: 16 }}>
                        <Link to={"/register"}>
                            추가
                        </Link>
                    </Button>
                    <Button type="danger" style={{ marginBottom: 16 }} onClick={deleteCompany}>
                        삭제
                    </Button>
                </Row>
                <Table
                    rowKey="kedcd"
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: event => {
                                history.push(`/chart?kedcd=${record.kedcd}`)
                            }
                        };
                    }}
                />
                <Search
                    placeholder="기업명 검색"
                    onChange={({target:{value}}) => setCompanyName(value)}
                   onSearch={onSearch}
                    style={{ width: 200, margin: '0 10px' }}
                />


            </div>
     )
}

