import React, { FC, Suspense, useEffect, lazy } from 'react';
import { connect, Dispatch } from 'umi';
import { Row ,Space} from 'antd';
import { Loading, DashboardState } from '@/models/connect';
import PageLoading from './components/PageLoading';
const Profit = lazy(() => import('./components/Profit'));
const DataReport = lazy(() => import('./components/DataReport'));
const VisitCard = React.lazy(() => import('./components/visitCard'));
interface DashboardProps {
  dispatch: Dispatch;
  dashboard: DashboardState;
  loading?: boolean;
}

const Dashboard: FC<DashboardProps> = ({ dashboard, dispatch, loading }) => {
  const { cardSource } = dashboard;

  useEffect(() => {
    dispatch({
      type: 'dashboard/queryCard',
      payload: {},
    });
  }, []);
  return (
    <div>
      <Suspense fallback={<PageLoading />}>
        {/* <VisitCard totalData={cardSource} loading={loading} /> */}
        <Space direction="vertical" size={30} className="g-w100">
          <Profit loading={loading} />
          <DataReport loading={loading} />
        </Space>
      </Suspense>
    </div>
  );
};

export default connect(
  ({
    dashboard,
    loading,
  }: {
    dashboard: DashboardState;
    loading: Loading;
  }) => ({
    dashboard,
    loading: loading.effects['dashboard/queryCard'],
  }),
)(Dashboard);
