import '@/styles/globals.css';
import 'nprogress/nprogress.css';
// 页面滚动元素动画
import 'aos/dist/aos.css';
// footer组件
import '@hankliu/rc-footer/assets/index.css';
// exception组件
import '@hankliu/rc-exception/assets/index.css';

import moment from 'moment';
import { ConfigProvider, Watermark } from '@hankliu/hankliu-ui';
import zhCN from '@hankliu/hankliu-ui/lib/locale/zh_CN';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import type { ReactElement, ReactNode } from 'react';

import useTopWindow from '@/hooks/useTopWindow';
import DefaultLayout from '@/layouts/index';
import { getRoutePrefix } from '@/utils/route';

import 'moment/locale/zh-cn';
moment.locale('zh-cn');

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

/**
 * 网站入口APP类
 * @param param0
 * @returns
 */
export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  const isTop = useTopWindow();

  return (
    <>
      <Head>
        <title>人生一格 - H.L</title>
        <link rel="icon" href={`${getRoutePrefix()}/favicon.ico`} />
        <meta
          name="description"
          content="人生进度条，人生是一条无止境的路，你永远不知道自己会遇到什么样的困难，但是你要相信，只要你勇敢地走过去，剩余的问题就显得微不足道了。"
        />
        <meta
          name="keywords"
          content="人生一格,人生格式化,人生小格,toolkit,toolkits,前端开发,前端开发工具,前端开发工具集合,在线工具,toolbox,frontend,卡鲁秋,Hank,HankLiu"
        />
        <meta name="author" content="Hank.Liu" />
      </Head>

      {getLayout(
        <ConfigProvider locale={zhCN}>
          <Watermark
            content={isTop ? 'HankLiu LifeCount' : ''}
            font={{ color: 'rgba(0, 0, 0, 0.1)' }}
            className="flex h-full flex-1 flex-col"
          >
            <Component {...pageProps} />
          </Watermark>
        </ConfigProvider>,
      )}
    </>
  );
}
