import React, { FC, memo, useState, useEffect } from 'react';

import { request } from 'umi';
import { Line } from '@ant-design/charts';
import { Skeleton, DatePicker, Row, Col } from 'antd';
import { RangeValue } from 'rc-picker/lib/interface'
const { RangePicker } = DatePicker;
interface IDataReport {
  loading: boolean | undefined;
}
const DataReport: FC<IDataReport> = ({ loading }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    request(
      'https://gw.alipayobjects.com/os/bmw-prod/e00d52f4-2fa6-47ee-a0d7-105dd95bde20.json',
    ).then(response => {
      console.log('response', response);
      setData(response.slice(0, 40));
    });
  };
  const config = {
    data: data,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    yAxis: {
      label: {
        formatter: function formatter(v:any) {
          return ''.concat((v / 1000000000).toFixed(1), ' B');
        },
      },
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  const onDateChange = (date: RangeValue<any>) => {
    console.log('date', date)

  }
  return (
    <>
      <Skeleton loading={false}>
        <Row align='middle' gutter={20}>
          <Col className="s-fs-16 s-title">数据报表</Col>
          <Col>
            <RangePicker onChange={onDateChange}/>
          </Col>
        </Row>
        <Line {...config} legend={{ position: 'top' }} />
      </Skeleton>
    </>
  );
};

export default memo(DataReport);
