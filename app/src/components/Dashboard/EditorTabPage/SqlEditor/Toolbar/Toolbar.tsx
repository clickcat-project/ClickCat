import React from 'react';
import { FlexProps } from 'reflexy';
import { SelectValue } from 'antd/lib/select';
import { ServerStructure } from 'services';
import { Statistics } from 'services/api/DataDecorator';
import { Props as ActionButtonProps } from './ActionButton';
import css from './Toolbar.css';
import { CaretRightFilled } from '@ant-design/icons';

export enum ActionType {
  Save = 1,
  RunCurrent = 2,
  RunAll = 3,
  Fullscreen = 4,
  Suspend = 5,
}

export interface ToolbarProps extends Pick<ActionButtonProps<ActionType>, 'onAction'> {
  databases: ReadonlyArray<ServerStructure.Database>;
  currentDatabase: string;
  onDatabaseChange?: (db: ServerStructure.Database) => void;
  stats?: Statistics;
  loaded?: boolean,
  rows: string,
  onAction: (action: ActionType, eventData?: any, rows?: string) => void;
}

function SpaceH() {
  return <div className={css['space-h']} />;
}

export default class Toolbar extends React.Component<ToolbarProps & FlexProps> {
  private onDatabaseChange = (value: SelectValue) => {
    const { onDatabaseChange } = this.props;
    if (!onDatabaseChange) return;

    const { databases } = this.props;
    const db = databases.find((_) => _.name === value?.toString());
    db && onDatabaseChange(db);
  };

  render() {
    const { databases, currentDatabase, onDatabaseChange, onAction, stats, rows, loaded = false, ...rest } = this.props;

    // const onActionMenuClick = (click: MenuInfo) => {
    //   onAction(parseInt(click.key, 0), click.domEvent);
    // };
    // const onActionRunRunCurrent = (event: React.MouseEvent<HTMLElement>) => {
    //   onAction(ActionType.RunCurrent, event);
    // };

    // const menu = (
    //   <Menu onClick={onActionMenuClick}>
    //     <Menu.Item key={ActionType.RunCurrent}>
    //       <CaretRightOutlined style={{ color: 'green' }} />
    //       Run current ⌘ + ⏎
    //     </Menu.Item>

    //     <Menu.Item key={ActionType.RunAll}>
    //       <ForwardOutlined style={{ color: 'green' }} />
    //       Run all ⇧ + ⌘ + ⏎
    //     </Menu.Item>
    //   </Menu>
    // );

    return (
      <section className={css.toolbarBox} {...rest}>
      {/* <Flex className={css.toolbar} alignItems="center" {...rest}> */}
        {/* <Flex shrink={false}> */}
        <section onClick={(event: React.MouseEvent<HTMLElement>) => {
          if (loaded) return
          onAction(ActionType.RunCurrent, event, rows);
          // onAction(ActionType.RunCurrent, e);
        }} className={`${css.iconBox} ${loaded ? css.loaded : ''}`}>
          <CaretRightFilled />
        </section>
        
        {/* <SpaceH /> */}
          {/* <Dropdown.Button size="small" onClick={onActionRunRunCurrent} overlay={menu}>
            <CaretRightOutlined style={{ color: 'green' }} />
            <b>Run current</b>
          </Dropdown.Button> */}

          {/* <SpaceH /> */}

          {/*/!*icon="save"*!/*/}
          {/*<ActionButton size="small" actionType={ActionType.Save} onAction={onAction}>*/}
          {/*  <SaveOutlined />*/}
          {/*</ActionButton>*/}

          {/* <SpaceH /> */}

          {/*<Select*/}
          {/*  size="small"*/}
          {/*  dropdownMatchSelectWidth={false}*/}
          {/*  value={currentDatabase}*/}
          {/*  onChange={this.onDatabaseChange}*/}
          {/*>*/}
          {/*  {databases.map((db) => (*/}
          {/*    <Select.Option key={db.name} value={db.name}>*/}
          {/*      {db.name}*/}
          {/*    </Select.Option>*/}
          {/*  ))}*/}
          {/*</Select>*/}

          {/* <SpaceH /> */}
        {/* </Flex> */}

        {/* <Flex grow justifyContent="flex-end">
          {stats && (
            <>
              <SpaceH />
              <RequestStats {...stats} />
            </>
          )}

          <SpaceH />
        </Flex> */}
      {/* </Flex> */}
    </section>
    );
  }
}
