import React from 'react';
import { observer } from 'mobx-react';
import { Form, Input } from 'antd';
import { DemoConnectionModel, DirectConnectionModel } from 'models';
import { error2status } from 'components/utils';
import ActionButtons, { ActionButtonsProps } from '../ActionButtons';
import { GlobalOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import name from '../../../assets/images/name.svg'
import query from '../../../assets/images/query.svg'
import css from './DirectSignInForm.css'
import { ConnectionType } from 'services';

export interface Props extends ActionButtonsProps {
  model: DirectConnectionModel | DemoConnectionModel;
  className: string
}

@observer
export default class DirectSignInForm extends React.Component<Props> {
  render() {
    const {
      model,
      model: { changeField, errors },
      className,
      ...rest
    } = this.props;

    const isDemo = model.type === ConnectionType.Demo

    return (
      <Form className={className} layout="vertical">
        <Form.Item
          className={`${css.itemPosition} ${isDemo ? css.disabled : ''}`}
          help="For example: dev"
          validateStatus={error2status(errors.connectionName.error.nonEmpty())}
        >
          <img className={css.imgIcon} src={name} alt="" />
          <Input
            name="connectionName"
            placeholder="Name"
            disabled={isDemo}
            value={model.connectionName}
            onChange={changeField}
          />
        </Form.Item>

        <Form.Item
          className={`${css.itemPosition} ${isDemo ? css.disabled : ''}`}
          help="http://<host>:<port>"
          validateStatus={error2status(errors.connectionUrl.error.nonEmpty())}
        >
          <GlobalOutlined className={css.fontIcon} />
          <Input
            name="connectionUrl"
            disabled={isDemo}
            placeholder="http://host:port"
            value={model.connectionUrl}
            onChange={changeField}
          />
        </Form.Item>

        <Form.Item className={`${css.itemPosition} ${isDemo ? css.disabled : ''}`} validateStatus={error2status(errors.username.error.nonEmpty())}>
          <UserOutlined className={css.fontIcon} />
          <Input
            name="username"
            placeholder="Login"
            disabled={isDemo}
            value={model.username}
            onChange={changeField}
          />
        </Form.Item>

        <Form.Item className={`${css.itemPosition} ${isDemo ? css.disabled : ''}`}>
          <LockOutlined className={css.fontIcon} />
          <Input
            name="password"
            type="password"
            disabled={isDemo}
            placeholder="Password"
            value={model.password}
            onChange={changeField}
          />
        </Form.Item>

        <Form.Item
          className={`${css.itemPosition} ${isDemo ? css.disabled : ''}`}
          help="key1=value&key2=value"
          validateStatus={error2status(errors.params.error.nonEmpty())}
        >
          <img className={css.imgIcon} src={query} alt="" />
          <Input
            name="params"
            disabled={isDemo}
            placeholder={model.params}
            onChange={changeField}
          />
        </Form.Item>

        <Form.Item>
          <ActionButtons {...rest} />
        </Form.Item>
      </Form>
    );
  }
}
