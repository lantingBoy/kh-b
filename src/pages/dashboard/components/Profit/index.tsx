import React, { FC, memo } from 'react';
import { Row, Col, Skeleton,Button } from 'antd';
import LableCol from '../LableCol';

interface IProfit {
  loading:boolean | undefined
}
const Profit: FC<IProfit> = ({loading}) => {
  return (
    <Skeleton loading={loading}>
      <Row>
        <LableCol
          label="结算中收益(元)"
          showIcon
          value={3}
          tips="已获得但还未完成结算，不能立即发起提现的收益，包括上周六至当前的所有收益。"
        />
        <LableCol
          label="可提现收益(元)"
          showIcon
          value={3}
          button={ <Button type="primary">提现</Button>}
          tips="已入账但还未完成结算，不能立即发起提现的收益，包括上周六至当前的所有收益。(最小提现金额100元)"
        />
        <LableCol
          label="提现中收益(元)"
          showIcon
          value={3}
          tips="已提交提现申请，但我方财务还未收到发票信息和结算确认函，未能完成打款的收益。"
        />
        <LableCol
          label="已提现收益(元)"
          showIcon
          equal
          value={3}
          button={<Button type="primary">提现记录</Button>}
          tips="已完成提现的收益总和。"
        />
        <LableCol
          label="累计收益(元)"
          value={3}
          tips="所获得的所有收益，包含可提现、结算中、提现中和已提现收益。"
        />
      </Row>
    </Skeleton>
  );
};

export default memo(Profit);
