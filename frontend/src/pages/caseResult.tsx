import './caseResult.css'
import { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Select, message, Pagination, Tag, TableProps, DatePicker, Space, DatePickerProps, Input, InputRef, TableColumnType } from 'antd';
import { getCaseResultsApi, getTestUsersApi, getUsersApi } from '../api/api';
import { Role, roleName, useRequireAuth } from '../utils/requireAuth';
import { t } from '../utils/i18n';
import { conclusionOptions, CaseResult, TestUserType, SearchFormFieldType } from '../types/result';
import TextArea from 'antd/es/input/TextArea';
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';

const { RangePicker } = DatePicker;
type DataIndex = keyof CaseResult;

export default function CaseResultsPage() {
    useRequireAuth();
    const [searchForm] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [testUsers, setTestUsers] = useState<TestUserType[]>([]);
    const [testUserMap, setTestUserMap] = useState<Map<number, TestUserType>>(new Map());
    const [caseResults, setCaseResults] = useState<CaseResult[]>([]);
    useEffect(() => {
        getResults();
        getUsers();
    }, []);
    const getResults = (page: number = 1, page_size: number = 10) => {
        // 在组件加载时从后端接口获取数据
        getCaseResultsApi<PaginationData<CaseResult>>(page, page_size).then(res => {
            if (res.code == 0 && res.data) {
                setCaseResults(res.data.data)
                setTotal(res.data.total)
                setLoading(false)
            } else {
                message.error(res.message)
            }
        }
        )
    }
    const getUsers = () => {
        // 在组件加载时从后端接口获取数据
        getTestUsersApi<TestUserType[]>().then(res => {
            if (res.code == 0 && res.data) {
                setTestUsers(res.data)
                setTestUserMap(new Map(res.data.map(user => [user.id, user])))
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
    const handlerChange = (value: number) => {
        // 更新数据
    }
    const handleTableChange: TableProps<CaseResult>['onChange'] = (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter);

    };
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
      ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
      };
    
      const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
      };
    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<CaseResult> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  setSearchText((selectedKeys as string[])[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
              </Button>
          
            </Space>
          </div>
        ),
       
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
        filterDropdownProps: {
          onOpenChange(open) {
            if (open) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });
    const columns = [
        {
            title: t('result.case_id'),
            dataIndex: 'case_id',
            key: 'case_id',
            width: "8%",
            ellipsis: true,
            filterSearch: true,
            ...getColumnSearchProps("case_id")
        },
        {
            title: t('result.case_name'),
            dataIndex: 'case_name',
            key: 'case_name',
            ellipsis: true,
            filterSearch: true,
            ...getColumnSearchProps("case_name")
        },
        {
            title: t('result.start_time'),
            dataIndex: 'start_time',
            key: 'start_time',
            filtered: true,
            filterDropdown: () => (
                <div style={{ padding: 8 }}>
                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={(_, dateString: string[]) => {
                            // [ "2024-12-03", "2025-01-14" ]
                            console.log(dateString);

                        }}
                    />
                </div>
            ),
        },
        {
            title: t('result.result'),
            dataIndex: 'result',
            key: 'result',
            width: '5%',
            filters: [
                { text: t("result.fail"), value: false },
                { text: t("result.success"), value: true },
            ],
            render: (_text: string, record: CaseResult) => (
                <Tag color={record.conclusion < 4 ? "green" : "red"}>
                    {record.conclusion < 4 ? t("result.success") : t("result.fail")}
                </Tag>
            )
        },
        {
            title: t('result.guardian'),
            dataIndex: 'guardian',
            key: 'guardian',
            width: '8%',
            filters:
                testUsers.map((user) => ({
                    text: user.nickname,
                    value: user.id
                }))
            ,
            filterSearch: true,
            render: (_text: string, record: CaseResult) => (
                <p>
                    {testUserMap.get(record.guardian)?.nickname || ''}
                </p>
            )
        },
        {
            title: t('result.handler'),
            dataIndex: 'handler',
            key: 'handler',
            width: '8%',
            filters: testUsers.map(user => ({
                text: user.nickname,
                value: user.id
            })),
            filterSearch: true,
            render: (_text: string, record: CaseResult) => (
                <Select
                    style={{ width: 100 }}
                    defaultValue={record.handler}
                    onChange={handlerChange}
                    options={
                        testUsers.map(user => ({
                            value: user.id,
                            label: user.nickname || ""
                        }))
                    }
                >
                </Select>
            )
        },
        {
            title: t('result.conclusion'),
            dataIndex: 'conclusion',
            key: 'conclusion',
            width: '8%',
            filters: conclusionOptions.map((item) => ({ text: item.label, value: item.value })),
            render: (_text: string, record: CaseResult) => (
                <Select
                    style={{ width: 100 }}
                    defaultValue={record.handler}
                    onChange={handlerChange}
                    options={conclusionOptions}
                >
                </Select>
            )


        },
        {
            title: t('result.detail'),
            dataIndex: 'detail',
            key: 'detail',
            with: 300,
            render: (detail: string) => (
                <TextArea
                    maxLength={1000}
                    placeholder="输入处理详情"
                    style={{ height: 40, resize: 'none' }}
                    allowClear
                />
            )

        },
        {
            title: t('submit'),
            key: 'submit',
            render: (_text: string, record: CaseResult) => (
                <>
                    <Button type="default" onClick={() => handleEdit(record)}>{t('submit')}</Button>
                </>

            ),
        },
    ]

    return (
        <div>
            <Table dataSource={caseResults} columns={columns}
                tableLayout='fixed'
                size="small"
                scroll={{ x: "max-content", y: 600 }}
                pagination={false} rowKey="id"
                loading={loading}
                onChange={handleTableChange}
            />
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

