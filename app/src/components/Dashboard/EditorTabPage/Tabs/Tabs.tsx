import React from 'react';
import { Omit } from 'typelevel-ts';
import { Tabs as AntdTabs } from 'antd';
import { TabsProps as AntdTabsProps } from 'antd/lib/tabs';
import { Statistics } from 'services/api/DataDecorator';
import Actions, { ActionsProps } from './Actions';
import css from './Tabs.css'

interface TabsProps
  extends Omit<AntdTabsProps, 'tabBarExtraContent' | 'className' | 'type'>,
    ActionsProps {}


export const Tabs: React.FC<
  TabsProps & {stats?: Statistics, containerClass?: string}
> = ({ pinned, stats, onAction, containerClass, ...rest }) => (
  <AntdTabs
    className={css.EditorPageTabs}
    type="card"
    animated={false}
    tabBarExtraContent={<Actions containerClass={containerClass} pinned={pinned} stats={stats} onAction={onAction} />}
    {...rest}
  />
);
export const TabsTabPane = AntdTabs.TabPane;
