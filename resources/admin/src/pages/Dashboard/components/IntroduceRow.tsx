import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip } from 'antd';

import React from 'react';
import numeral from 'numeral';
import { ChartCard, MiniProgress, Field } from './Charts';
import Trend from './Trend';
import Yuan from '../utils/Yuan';
import styles from '../style.less';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = ({ loading }: { loading: boolean; }) => (
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title={'总销售额'}
        action={
          <Tooltip
            title={'指标说明'}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        total={() => <Yuan>126560</Yuan>}
        footer={
          <Field
            label={'日销售额'}
            value={`￥${numeral(12423).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <Trend flag="up" style={{ marginRight: 16 }}>
          周同比
          <span className={styles.trendText}>12%</span>
        </Trend>
        <Trend flag="down">
          日同比
          <span className={styles.trendText}>11%</span>
        </Trend>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title={'运营活动效果'}
        action={
          <Tooltip
            title={'指标说明'}
          >
            <InfoCircleOutlined />
          </Tooltip>
        }
        total="78%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
              周同比
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              日同比
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
