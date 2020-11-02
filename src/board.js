import React, {useEffect, useState} from 'react'
import {Input, Button, Table} from 'antd';
import axios from 'axios';
const { Search } = Input;

export default function Board() {
    const [ data, setData] = useState([]);
    const [ loading, setLoading ] = useState(false);
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
    const hasSelected = data.length > 0;

    useEffect(() => {
        const loadData = async () => {
           const res = await axios.get('http://localhost:3020/api/company', {headers: {
               'Access-Control-Allow-Origin': '*',
               }});
           const { rows } = res.data
           setData((rows))
        }
        loadData()
    },[])

    return  (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `Selected ${data.length} items` : ''}
                    </span>
                </div>
                <Button  type="primary" style={{ marginBottom: 16 }}>
                    Add a row
                </Button>
                <Button  type="danger" style={{ marginBottom: 16 }}>
                    Delete
                </Button>
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

