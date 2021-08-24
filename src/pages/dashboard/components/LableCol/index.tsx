import React, { FC, memo } from 'react';

import { Col, Tooltip } from 'antd';
import {
  QuestionCircleFilled,
  PlusOutlined,
  PauseOutlined,
} from '@ant-design/icons';
interface ILableCol {
  label: string;
  value: number;
  tips?: string;
  showIcon?: boolean;
  equal?: boolean;
  button?: React.ReactElement;
}
const LableCol: FC<ILableCol> = ({ label, value, tips, showIcon, equal ,button}) => {
  return (
    <Col span={showIcon ? 5 : 4} className="g-tac">
      <div className="g-flex g-flex-center g-flex-v-center g-p-rt">
        <span className="s-fs-16">
          {label}
          <Tooltip title={tips} className="g-cur-p g-ml-5">
            <QuestionCircleFilled />
          </Tooltip>
        </span>
        {showIcon &&
          (equal ? (
            <PauseOutlined
              className="g-p-ab g-r0"
              style={{ transform: 'rotate(90deg)' }}
            />
          ) : (
            <PlusOutlined className="g-p-ab g-r0" />
          ))}
      </div>
      <div className="g-tac s-fs-20 g-ptb-15 s-fc-main">{value}</div>
      {
        button
        }
    </Col>
  );
};

export default memo(LableCol);
