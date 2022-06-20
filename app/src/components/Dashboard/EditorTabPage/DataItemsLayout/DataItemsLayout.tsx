import React from 'react';
import { QueryResult } from 'models';
import DataDecorator from 'services/api/DataDecorator';
import { ItemCallback } from 'react-grid-layout';
import GridLayout, { getItemLayoutDefault, GridLayoutProps, ItemLayoutProps } from '../GridLayout';
import css from './DataItemsLayout.css';

interface Props extends GridLayoutProps<QueryResult> {
  renderItem: (data: DataDecorator) => React.ReactNode;
  onResize: ItemCallback | undefined;
}

function getItemLayout(
  item: QueryResult,
  props: ItemLayoutProps
): ReactGridLayout.Layout {
  console.log(item.result.map(() => props.itemHeight).getOrElse(2), 'item.result.map(() => props.itemHeight).getOrElse(2)')
  return {
    ...getItemLayoutDefault(item, props),
    h: 3, // if result has error
    i: item.id,
  };
}
export default function DataItemsLayout({ item, renderItem, onResize, ...rest }: Props) {
  if(item != null ) {
    return (
      <GridLayout item={item} onResizeStop={onResize} getItemLayout={getItemLayout} {...rest}>
        {
          <div key={item.id} className={css['grid-item']}>
            {item.result.fold(
              (ex) => (
                <textarea className={css.error} defaultValue={String(ex)} />
              ),
              (data) => {
                if (!data.isResultText) {
                  return renderItem(data);
                }
                // Example query: SELECT * FROM system.tables format Vertical

                if (data.error) {
                  return <textarea className={css.error} defaultValue={data.text} />;
                }

                return <textarea className={css.text} defaultValue={data.text} />;
              }
            )}
          </div>

        }

      </GridLayout>
    );
  }else{
    return (
      <GridLayout item={item} onResizeStop={onResize}  {...rest}>
      </GridLayout>
    );
  }
   
}
