import React, {Suspense, useEffect, useState} from 'react';
import { GridContent, PageContainer } from '@ant-design/pro-layout';
import PageLoading from './components/PageLoading';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));

export default () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [])

  return (
    <GridContent>
      <React.Fragment>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} />
        </Suspense>
      </React.Fragment>
    </GridContent>
  );
}
