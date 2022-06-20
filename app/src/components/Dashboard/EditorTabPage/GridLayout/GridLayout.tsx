import React, { useMemo } from 'react';
import { Childrenable } from 'reflexy';
import ReactGridLayout, { ItemCallback, WidthProvider } from 'react-grid-layout';
import { Omit } from 'typelevel-ts';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayoutFilled = WidthProvider(ReactGridLayout);

export type ItemLayoutProps = Omit<GridLayoutProps, 'item' | 'getItemLayout' | 'width'>;

export interface GridLayoutProps<Item = any> extends Childrenable {
  item: Item;
  cols: number;
  itemWidth: number;
  itemHeight: number;
  rowHeight?: number;
  width?: number;
  locked?: boolean;
  getItemLayout?: (item: Item, props: ItemLayoutProps) => ReactGridLayout.Layout;
  onResizeStop?: ItemCallback | undefined;
}

export function getItemLayoutDefault(
  _item: any,
  { itemWidth, itemHeight, cols }: ItemLayoutProps
): ReactGridLayout.Layout {
  return {
    x: 0,
    y: 0,
    w: itemWidth,
    h: itemHeight,
    minH: 2,
    i: '0',
  };
}

function calculateLayout({
  item,
  cols,
  itemWidth,
  itemHeight,
  getItemLayout = getItemLayoutDefault,
}: GridLayoutProps): ReactGridLayout.Layout[] {
  return new Array(getItemLayout(item, { itemHeight, itemWidth, cols }));
  }

export default function GridLayout(props: GridLayoutProps) {
  const {
    width,
    rowHeight = 50,
    children,
    item,
    cols,
    itemHeight,
    itemWidth,
    locked,
    getItemLayout,
    onResizeStop,
  } = props;


  const layout = useMemo(
    () => calculateLayout(props),
    [cols, item, itemHeight, itemWidth, getItemLayout]
  );

  // refactor: detect initial width through props
  const GLayout = width ? ReactGridLayout : ReactGridLayoutFilled;
  // const Layout = ReactGridLayoutFilled;

  return (
    <GLayout
      onResizeStop={onResizeStop}
      layout={layout}
      cols={cols}
      width={width}
      rowHeight={rowHeight}
      containerPadding={[0, 0]}
      isDraggable={!locked}
      isResizable={!locked}
      // isRearrangeable={!locked}
      useCSSTransforms={false}
    >
      {children}
    </GLayout>
  );
}
