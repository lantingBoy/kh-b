import React from "react";
import { Row, Col } from "antd";
interface IHeader {
  extra?: React.ReactElement;
  title:string
}
const Header: React.FC<IHeader> = ({title,extra }) => {
  return (
    <>
      <Row justify="space-between" className="g-pb-20">
        <Col className="s-fs-18 s-title">{title}</Col>
        {extra && <Col>{extra}</Col>}
    </Row>
    </>

  )
}

export default React.memo(Header)
