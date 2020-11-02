import React, {useEffect, useState} from 'react'
import {Input, Button, Table, Row} from 'antd';
import axios from 'axios';
const { Search } = Input;

export default function Board() {
    const [ data, setData] = useState([]);
    const columns = [
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
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };

    useEffect(() => {
        const loadData = async () => {
           const res = await axios.get('http://localhost:3020/api/company', {
               headers: {
                   'Access-Control-Allow-Origin': '*',
               }});
           const { rows } = res.data
           setData((rows))
        }
        loadData()
    },[])

    const addData = async () => {
        const res = await axios.post('http://localhost:3020/api/company', {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: {
                test: 1
            }
        });
    }

    return  (
            <div>
                <Row style={{marginTop: 16}}>
                    <Button type="primary" style={{ marginBottom: 16, marginRight: 16 }} onClick={addData}>
                        추가
                    </Button>
                    <Button type="danger" style={{ marginBottom: 16 }}>
                        삭제
                    </Button>
                </Row>
                <Table rowKey="kedcd" rowSelection={rowSelection} columns={columns} dataSource={data} />
                <Search
                    placeholder="input search text"
                    allowClear
                   // onSearch={onSearch}
                    style={{ width: 200, margin: '0 10px' }}
                />

            </div>
     )
}

