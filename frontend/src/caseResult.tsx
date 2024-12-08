// import './App.css'
import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, message, Popconfirm, Pagination } from 'antd';
import { getCaseResultsApi } from './api/api';
import { Role, roleName, useRequireAuth } from './utils/requireAuth';
import { t } from './utils/i18n';
export default function CaseResultsPage() {
    useRequireAuth();
    const [visible, setVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [caseResults, setCaseResults] = useState<CaseResult[]>([]);
    useEffect(() => {
        getResults();

    }, []);
    const getResults = (page: number = 1, page_size: number = 10) => {
        // 在组件加载时从后端接口获取数据
        getCaseResultsApi<PaginationData<CaseResult>>(page, page_size).then(res => {
            if (res.code == 0 && res.data) {
                setCaseResults(res.data.data)
                setTotal(res.data.total)
            } else {
                message.error(res.message)
            }
        }
        )
    }
    const handleEdit = (record: CaseResult) => {
        Modal.confirm({
            title: t('result.edit'),
            content: (
                <Form
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={record}
                    autoComplete="off"
                    onFinish={(values) => {
                        // 更新数据
                    }}
                />
            )
        })
    }
    const columns = [
        {
            title: t('result.name'),
            dataIndex: 'casename',
            key: 'casename',
        },
        {
            title: t('result.name'),
            dataIndex: 'casename',
            key: 'casename',
        },
        {
            title: t('result.result'),
            dataIndex: 'result',
            key: 'result',
        },
        {
            title: t('result.handler'),
            dataIndex: 'handler',
            key: 'handler',
            render: () => (
                <>
                    <Select>
                        <Option value={Role.admin}>{roleName[Role.admin]}</Option>
                        <Option value={Role.special}>{roleName[Role.special]}</Option>
                        <Option value={Role.user}>{roleName[Role.user]}</Option>
                        <Option value={Role.guest}>{roleName[Role.guest]}</Option>
                    </Select>
                </>
            )
        },
        {
            title: t('result.conclusion'),
            dataIndex: 'conclusion',
            key: 'conclusion',

        },
        {
            title: t('action'),
            key: 'action',
            render: (_text: string, record: CaseResult) => (
                <>
                    <Button type="default" onClick={() => handleEdit(record)}>{t('edit')}</Button>
                </>

            ),
        },
    ]

    return (
        <div>
            <Table dataSource={caseResults} columns={columns}
                pagination={false} rowKey="id" scroll={{ y: 400 }} />
            <Pagination
                total={total}
                style={{ 'float': 'right', marginRight: "3em" }}
                showTotal={(total) => `${total}`}
                locale={{ items_per_page: `/ ${t("page")}` }}
                onChange={(page, page_size) => { getResults(page, page_size) }}
                showSizeChanger
            />
        </div>
    )
}

