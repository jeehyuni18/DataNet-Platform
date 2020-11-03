import React, {useEffect, useState} from 'react'
import {
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete, Card,
} from 'antd';
import axios from "axios";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";

const { Option } = Select;

const Register =  () => {
    const [ formData, setFormData ] = useState({});
    const [ kedcdRule, setKedcdRule ] = useState([{
        type: 'string',
        len: 10,
        required: true,
        message: '10자리의 ked-idx를 입력해주세요',
    }]);
    const onChangeFormData = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }

    const register = async () => {
        await axios.post(`${process.env.API_HOST}/api/company`, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            data: formData
        });
    }



    return (
        <Card>
            <Form
                name="register"
                scrollToFirstError
            >
                <Form.Item
                    name="kedcd"
                    label="kedcd"
                    rules={[
                        {
                            type: 'string',
                            len: 10,
                            required: true,
                            message: '10자리의 ked-idx를 입력해주세요',
                        }
                    ]}
                 >
                    <Input onChange={e => onChangeFormData('kedcd',e.target.value)} />
                </Form.Item>

                <Form.Item
                    name="companyName"
                    label="기업명"
                >
                    <Input onChange={e => onChangeFormData('companyName',e.target.value)} />
                </Form.Item>

                <Form.Item
                    name="industryName"
                    label="업종"
                >
                    <Input onChange={e => onChangeFormData('industryName',e.target.value)}/>
                </Form.Item>

                <Form.Item
                    name="businessNum"
                    label="사업자등록번호"
                >
                    <Input onChange={e => onChangeFormData('businessNum',e.target.value)} />
                </Form.Item>

                <Form.Item
                    name="scale"
                    label="기업규모"
                >
                    <Select placeholder="기업 규모를 골라주세요" onChange={value => onChangeFormData('scale',value)}>
                        <Option value="대기업">대기업</Option>
                        <Option value="중기업">중기업</Option>
                        <Option value="소기업">소기업</Option>
                        <Option value="소상공인">소상공인</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="product"
                    label="제품명"
                >
                    <Input style={{ width: '100%' }} onChange={e => onChangeFormData('product',e.target.value)}/>
                </Form.Item>
                <Form.Item
                    name="connect"
                    label="연결기업"
                >
                    <Select style={{ width: '100%' }} disabled defaultValue="엘지">
                        <Select.Option value="엘지">
                            엘지
                        </Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit" onClick={register}>
                        <Link to="/board">
                            추가
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default Register