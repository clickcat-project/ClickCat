import React, { useEffect } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import css from './FullScreener.css'

interface Props {
  enter: boolean;
  afterChange?: () => void;
  children?: React.ReactNode;
}

export default function FullScreener({ children, enter, afterChange }: Props) {
  const handle = useFullScreenHandle();
  useEffect(() => {
    if (enter) handle.enter().finally(() => {
      afterChange && afterChange()
    });
    else handle.exit().finally(() => {
      afterChange && afterChange()
    });
    
  }, [enter]);
  return <FullScreen className={css.setOverflow} handle={handle}>{children}</FullScreen>;
}
