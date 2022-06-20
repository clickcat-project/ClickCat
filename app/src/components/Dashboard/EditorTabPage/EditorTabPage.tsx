import React from 'react';
import { observer } from 'mobx-react';
import { Option } from 'funfix-core';
import { FieldChangeHandler } from 'module/mobx-utils';
import { EditorTab } from 'models';
import { TabsStore } from 'stores';
import { ServerStructure } from 'services';
import DataDecorator from 'services/api/DataDecorator';
import Splitter from 'components/Splitter';
import SqlEditor from './SqlEditor';
import { ActionType as EditorActionType } from './SqlEditor/Toolbar';
import { TextInsertType } from './SqlEditor/types';
import SaveModal from './SaveModal';
import { Tabs, ResultTabActionType } from './Tabs';
import DataItemsLayout from './DataItemsLayout';
import DataTable, { ExportData, DataTableProps, ResultTableActionType } from './DataTable';
import Draw from './Draw';
import Progress from './Progress';
import { TabsTabPane } from './Tabs/Tabs';
import FullScreener from './FullScreener';
import { notification } from 'antd';
import css from './EditorTabPage.css'
interface Props {
  store: TabsStore;
  serverStructure?: ServerStructure.Server;
  model: EditorTab;
  onModelFieldChange: FieldChangeHandler<EditorTab>;
  width?: number;
}

@observer
export default class EditorTabPage extends React.Component<Props> {
  state = {
    enterFullScreen: false,
    rows: '100'
  };
  editorRef: any = null
  private onContentChange = (content: string) => {
    this.props.onModelFieldChange({ name: 'content', value: content });
  };

  private onDatabaseChange = (db: ServerStructure.Database) => {
    this.props.onModelFieldChange({ name: 'currentDatabase', value: Option.of(db.name) });
  };

  private setEditorRef = (editor: SqlEditor | null) => {
    this.editorRef = editor
    this.props.onModelFieldChange({ name: 'codeEditor', value: Option.of(editor) });
  };

  private onEditorAction = (action: EditorActionType, eventData?: any) => {

    switch (action) {
      case EditorActionType.Save: {
        const { store } = this.props;
        store.showSaveModal();
        break;
      }
      case EditorActionType.Fullscreen:
        break;
      case EditorActionType.RunCurrent:
      case EditorActionType.RunAll: {
        this.editorRef?.setLoaded(true)
        const { store } = this.props;
        store.execQueries(eventData).finally(() => {
          this.editorRef?.setLoaded(false)
        });
        break;
      }
      default:
        break;
    }
  };

  private onResultTabAction = (action: ResultTabActionType, subEvent = '') => {
    const { model } = this.props;
    switch (action) {
      case ResultTabActionType.TogglePin: {
        const { onModelFieldChange: onTabModelFieldChange, model } = this.props;
        onTabModelFieldChange({ name: 'pinnedResult', value: !model.pinnedResult });
        break;
      }
      case ResultTabActionType.Fullscreen: {
        const v = this.state.enterFullScreen;
        this.setState({ enterFullScreen: !v });
        break;
      }
      case ResultTabActionType.Export: {
        try {
          const queriesResult = model?.queriesResult?.get()
          const resultData = queriesResult?.result?.get()
          if (!queriesResult || !resultData?.rows?.length) {
            notification.error({
              key: 'exportError',
              message: 'Export',
              description: 'No data',
              duration: 2
            })
          } else {
            ExportData(resultData, subEvent, model.title);
          }
        } catch (error) {
          notification.error({
            key: 'exportError',
            message: 'Export',
            description: 'No data',
            duration: 2
          })
        }
        break;
      }
      case ResultTabActionType.ChangeRows: {
        this.setState({
          rows: subEvent
        })
        break;
      }
      default:
        break;
    }
  };

  private copyToClipboard(text: string) {
    // const textarea = React.createElement(
    //   'textarea',
    //   { value: text, type: 'url', autoFocus: true },
    //   'body'
    // );
    const textarea: HTMLTextAreaElement = document.createElement('textarea');
    // if (textarea.style) {
    // textarea.style.width = 0;
    // textarea.style.height = 0;
    // textarea.style.border = 0;
    // textarea.style.position = 'absolute';
    // textarea.style.top = 0;
    // }
    // textarea.innerText = text;
    document.body.appendChild(textarea);
    textarea.value = text;
    // textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.log('Oops, unable to copy');
    }
    document.body.removeChild(textarea);
    return true;
  }

  private onDataTableAction: DataTableProps['onAction'] = (action, data) => {
    if (action === ResultTableActionType.Insert) {
      // to insert result to editor ( where cursor )
      console.log('insert result:');
      console.info(`%c${data}`, 'color: #bada55');
      const { model } = this.props;
      model.codeEditor.forEach((editor) => editor.insertText(data, TextInsertType.Sql));
    }
    if (action === ResultTableActionType.Show) {
      // to show result in elements
      console.log('show result:');
      console.info(`%c${data}`, 'color: #bada55');
      const { onModelFieldChange } = this.props;
      onModelFieldChange({ name: 'tableData', value: Option.of(data) });
    }
    if (action === ResultTableActionType.Clipboard) {
      // to clipboard text
      console.log('to Clipboard result:');
      console.info(`%c${data}`, 'color: #bada55');
      this.copyToClipboard(data);
    }
  };

  private renderTable = (data: DataDecorator) => (
    <DataTable data={data} onAction={this.onDataTableAction} fill />
  );

  private renderDraw = (data: DataDecorator) => <Draw data={data} fill />;

  private onResizeGrid = () => {
    //
    console.log('on Resize Grid');
    //
  };

  render() {
    const { store, serverStructure, model, width } = this.props;
    const queryResult = model.queriesResult.getOrElse(null!);
    const totalStats = queryResult != null ? model.queriesResult.get().totalStats : null!;
    const {
      rows
    } = this.state
    const containerClass = 'editor-tab-page-fullscreen-container'
    return (
      <div style={{width: '100%', height: '100%'}} className={containerClass}>
        <React.Fragment>
          <FullScreener enter={this.state.enterFullScreen}>
            <Splitter className='sql-margin-bottom' split="horizontal" minSize={100} defaultSize={350}>
              <SqlEditor
                content={model.content}
                onContentChange={this.onContentChange}
                serverStructure={serverStructure}
                currentDatabase={model.currentDatabase.getOrElse('')}
                onDatabaseChange={this.onDatabaseChange}
                onAction={this.onEditorAction}
                stats={totalStats}
                ref={this.setEditorRef}
                rows={rows}
                fill
              />
              {/* The setting of the height of the parent element flex 1 and the child element does not take effect.
              You can solve this problem by adding {position: 'absolute', left: 0, right: 0, bottom: 0, top: 0} to the child element */}
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0}}>
                {model.tableData.map((data) => <div>{data}</div>).orUndefined()}

                <Tabs
                  defaultActiveKey="table"
                  pinned={model.pinnedResult}
                  stats={totalStats}
                  onAction={this.onResultTabAction}
                >
                  <TabsTabPane  key="table" tab="Data / Table">
                    {!!store.uiStore.executingQuery && (
                      <Progress query={store.uiStore.executingQuery} />
                    )}

                    <DataTable
                      data={queryResult ? queryResult?.result?.get() : new DataDecorator()}
                      onAction={this.onDataTableAction} fill
                    />

                    {/* <DataItemsLayout
                      onResize={this.onResizeGrid}
                      cols={4}
                      itemWidth={4}
                      itemHeight={10}
                      item={queryResult}
                      width={width}
                      renderItem={this.renderTable}
                      locked={model.pinnedResult}
                    /> */}
                  </TabsTabPane> 
  
                </Tabs>
              </div>
            </Splitter>

            {store.editedTab
              .filter((t) => t.model === model)
              .map((editedTab) => (
                <SaveModal
                  fieldName="title"
                  fieldValue={editedTab.title}
                  onFieldChange={editedTab.changeField}
                  onSave={store.saveEditedTab}
                  onCancel={store.hideSaveModal}
                />
              ))
              .orUndefined()}
          </FullScreener>
        </React.Fragment>
      </div>
    );
  }
}
