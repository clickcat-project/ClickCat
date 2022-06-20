import React from 'react';
import style from './CommonCard.css';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export default class CommonCard extends React.Component<Props> {
  render() {
    const { children, title } = this.props;
    if (title !== undefined) {
      return (
        <div className={style.commonCard + ' ' + style.isTitle}>
          <div className={style.cardTitle}>{title}</div>
          {children}
        </div>
      );
    } else {
      return <div className={style.commonCard}>{children}</div>;
    }
  }
}
