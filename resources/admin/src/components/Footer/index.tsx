import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright={ (new Date()).getFullYear() + " sheaxiang"}
    links={[
      {
        key: 'xiangxingyu',
        title: 'xiangxingyu',
        href: 'http://xiangxingyu.com',
        blankTarget: true,
      },
    ]}
  />
);
