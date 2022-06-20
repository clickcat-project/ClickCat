import { JSONModel, JSONObject, serialize } from 'module/mobx-utils';
import TabModel, { Tab, TabType } from './TabModel';

export interface TableViewTab extends Tab<TabType.TableView> {
  tableName: string;
  tableId: string;
  engine: string | undefined;
}

export default class TableViewTabModel extends TabModel<TableViewTab> implements TableViewTab {
  private static tabId = 'TableViewTabModelTabId';

  tableName = '';

  tableId = '';

  engine = '';

  static id(tableId: string) {
    return `${this.tabId}:${tableId}`;
  }

  static from({
    tableName = 'NA_NULL',
    tableId = 'NA_NULL',
    engine,
  }: Pick<JSONModel<Partial<TableViewTab>>, 'tableId' | 'tableName' | 'engine'>): TableViewTabModel {
    const r = new TableViewTabModel({
      type: TabType.TableView,
      id: TableViewTabModel.id(tableId),
      title: tableName,
      tableId,
      tableName,
      engine
    });
    console.warn(r);
    return r;
  }

  protected constructor(data: TableViewTab) {
    super(data);
    const { ...jsonModel } = this;
    this.tableId = data.tableId;
    this.tableName = data.tableName;
    this.engine = data.engine || ''
  }

  toJSON(this: TableViewTabModel): JSONModel<TableViewTab> {
    const { ...jsonModel } = this;
    return serialize(jsonModel);
  }
}
