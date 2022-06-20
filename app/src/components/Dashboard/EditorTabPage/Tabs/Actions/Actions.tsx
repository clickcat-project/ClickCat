import React, { useCallback, useState } from 'react';
import { Flex } from 'reflexy';
import RequestStats from '../../RequestStats';
import {
  FullscreenOutlined,
  VerticalAlignBottomOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Menu, Dropdown, Space, Divider } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Statistics } from 'services/api/DataDecorator';
import css from './Actions.css';
import classNames from 'classnames';

export enum ActionType {
  TogglePin = 1,
  Fullscreen = 2,
  Export = 3,
  ChangeRows = 4,
}

export interface ActionsProps {
  pinned?: boolean;
  onAction: (action: ActionType, subType?: string) => void;
  stats?: Statistics,
  className?: string,
  containerClass?: string
}

export default function Actions({ pinned, onAction, stats, className, containerClass }: ActionsProps) {
  const onTogglePin = useCallback(() => onAction(ActionType.TogglePin), [onAction]);
  const onToggleFullScreen = useCallback(() => onAction(ActionType.Fullscreen), [onAction]);
  const onClickExportMenu = useCallback(
    ({ key }: MenuInfo) => onAction(ActionType.Export, key),
    [onAction]
  );
  const onClickChangeRows = useCallback(
    (key: string) => onAction(ActionType.ChangeRows, key),
    [onAction]
  );
  const [size, setSize] = useState<string>('100')
  // let pinIcon = <PushpinOutlined className={css.icon} onClick={onTogglePin} />;
  // if (pinned) {
  //   pinIcon = <PushpinFilled className={css.icon} onClick={onTogglePin} />;
  // }

  const exportMenu = (
    <Menu onClick={onClickExportMenu}>
      <Menu.Item key="CSVHeaders">CSV with headers</Menu.Item>
      <Menu.Item key="CSV">CSV without headers</Menu.Item>
      <Menu.Item key="TSVHeaders">TSV with headers</Menu.Item>
      <Menu.Item key="TSV">TSV without headers</Menu.Item>
    </Menu>
  );

  const rowsMenu = <Menu onClick={({key}) => {
    setSize(key)
    onClickChangeRows(key)
  }}>
    <Menu.Item key="100">100 Rows</Menu.Item>
    <Menu.Item key="500">500 Rows</Menu.Item>
    <Menu.Item key="1000">1000 Rows</Menu.Item>
  </Menu>

  return (
    <Flex grow hfill alignItems="center" justifyContent="flex-end" className={classNames(css.root, className)}>
      <Space direction="vertical">
        <Space wrap size={2}>
          {stats && (
            <>
              <RequestStats {...stats} />
            </>
          )}
          <Dropdown overlayClassName={'light-dropdown'} overlay={rowsMenu} getPopupContainer={() => {
            return document.querySelector(`${containerClass?`.${containerClass} ` : ''}.fullscreen`) as HTMLElement
          }}>
            <a style={{color: 'rgba(62, 62, 69, 0.85)'}} onClick={e => e.preventDefault()}>
              <Space>
                {size} Rows
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
          <Divider type="vertical" />
          <Dropdown overlayClassName={'light-dropdown'} overlay={exportMenu} getPopupContainer={() => {
            return document.querySelector(`${containerClass?`.${containerClass} ` : ''}.fullscreen`) as HTMLElement
          }}>
            <VerticalAlignBottomOutlined className={css.icon} />
          </Dropdown>
          <Divider type="vertical" />
          {/* {pinIcon}
          <Divider type="vertical" /> */}
          <FullscreenOutlined className={css.icon} onClick={onToggleFullScreen}></FullscreenOutlined>
        </Space>
      </Space>
    </Flex>
  );
}
