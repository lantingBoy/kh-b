import React, {lazy,memo,useEffect}from 'react'

import { Row, Skeleton,Space, Table } from 'antd'
import useGet from '@/hooks/useGet'
import useTable from '@/hooks/useTable'
import Header from '@/components/Header'
const CashRecord = () => {

  const {run:gets}=useGet('http://112.74.32.217:8899/shangp/findGoodsInfo')
  const { tableProps, action } = useTable(
    {
      search: '`https://randomuser.me/api?results=55',
      delete: '/export/b/file/delete',
      downFile: '/export/b/file/download',
    },
    {
      manual: false,
      initSearchParams: {
        page: 1,
        size: 10,
      },
      dataSourceFormatter: (response:any) => {
        const { items, totalCount } = response?.data || {};
        return { items, totalCount };
      },
    },
  );
  useEffect(()=>{
    onSearch()
  },[])
  const onSearch = () => {
    gets({}).then(res=>{
      console.log('res', res)

    })
    /* action?.search({
      payload: {},
    }); */
  };
  const columns = [
    {
      title: 'name',
      dataIndex: ['name', 'last'],
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'gender',
      dataIndex: 'gender',
    },
  ];
  return (
    <Space>

      <Skeleton loading={false}>
        <Header title="提现记录" />
      </Skeleton>
      <Skeleton>
        <Table {...tableProps} rowKey="email" columns={columns}/>
      </Skeleton>
    </Space>
  )
}

export default memo(CashRecord)
