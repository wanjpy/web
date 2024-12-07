import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, message, Popconfirm, Pagination } from 'antd';
import { deleteUserApi, getUsersApi, updateUserApi } from './api/api';
import { Role, roleName } from './utils/requireAuth';
import { t } from './utils/i18n';

const { Option } = Select;



function UserListPage() {
    const [visible, setVisible] = useState(false);
    const [total, setTotal] = useState(0);
    const [userList, setUserList] = useState<UserDetail[]>([])
    const [form] = Form.useForm<UserDetail>();
    useEffect(() => {
        getUsers();

    }, []);
    const getUsers = (page: number = 1, page_size: number = 10) => {
        // 在组件加载时从后端接口获取数据
        getUsersApi<PaginationData<UserDetail>>(page, page_size).then(res => {
            if (res.code == 0 && res.data) {
                setUserList(res.data.data)
                setTotal(res.data.total)
            } else {
                message.error(res.message)
            }
        }
        )
    }
    const columns = [
        {
            title: t('login.username'),
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: t('login.email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('login.phone'),
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (_text: string, record: UserDetail) => (
                <Switch checked={record.status} onChange={(checked) => {
                    record.status = checked
                    updateUser(record)
                }} />
            ),
        },
        {
            title: t('role.title'),
            dataIndex: 'role',
            key: 'role',
            render: (role:number) => {return roleName[role]},
        },
        {
            title: t('action'),
            key: 'action',
            render: (_text: string, record: UserDetail) => (
                <>
                    <Button type="default" onClick={() => handleEdit(record)}>{t('edit')}</Button>
                    <Popconfirm
                        title="Are you sure delete this?"
                        onConfirm={() => deleteUser(record)}
                        okText={t("yes")}
                        cancelText={t('no')}
                    >
                        <Button type="default" danger>{t('delete')}</Button>
                    </Popconfirm>
                </>

            ),
        },
    ];


    const handleEdit = (record: UserDetail) => {
        form.setFieldsValue(record);
        setVisible(true);
    };
    const deleteUser = (record: UserDetail) => {
        deleteUserApi(record.id).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                getUsers()
            } else {
                message.error(res.message)
            }
        }
        )
    }
    function updateUser(user: UserDetail) {
        updateUserApi(user).then(res => {
            if (res.code === 0) {
                message.success(res.message)
                getUsers()
            } else {
                message.error(res.message)
            }
        })
    }

    const editHandleOk = () => {
        form.validateFields().then(values => {
            updateUser(values)
            setVisible(false);
        }).catch(errorInfo => {
            console.log('Validate Failed:', errorInfo);
        });
    };
    return (
        <div>
            {/* <Button type="primary" onClick={() => setVisible(true)}>Add User</Button> */}
            <Table dataSource={userList} columns={columns}
                pagination={false} rowKey="id" scroll={{ y: 400 }} />
            <Pagination
                total={total}
                style={{ 'float': 'right', marginRight: "3em" }}
                showTotal={(total) => `${total}`}
                locale={{ items_per_page: `/ ${t("page")}` }}
                onChange={(page, page_size) => { getUsers(page, page_size) }}
                showSizeChanger
            />
            <Modal
                title={t('editUser')}
                open={visible}
                onOk={editHandleOk}
                onCancel={() => setVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="id" hidden>
                        <Input />
                    </Form.Item>
                    <Form.Item name="username" label={t('login.username')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label={t('login.email')} rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label={t('login.phone')} rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label={t("status")} valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item name="role" label={t('role.title')} rules={[{ required: true }]}>
                        <Select>
                            <Option value={Role.admin}>{roleName[Role.admin]}</Option>
                            <Option value={Role.special}>{roleName[Role.special]}</Option>
                            <Option value={Role.user}>{roleName[Role.user]}</Option>
                            <Option value={Role.guest}>{roleName[Role.guest]}</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserListPage;
