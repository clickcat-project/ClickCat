import React from 'react';
import { Flex } from 'reflexy';
import css from './Loader.css';
import loading from 'assets/images/loading.svg';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Loader() {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <Flex center className={css.root}>
      <Spin indicator={antIcon} className={css.loadingIcon} />
      {/* <img className={css.loadingAni} src={loading} alt="" style={{width: '40px'}} /> */}
      <span className={css.loadingText}>&nbsp;&nbsp;loading...</span>
    </Flex>
  );
}
