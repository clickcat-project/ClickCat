// {
//   title: 'Name',
//   dataIndex: 'name',
//   render: (text: string) => <a>{text}</a>,
// }

// {name: 'time', type: 'DateTime', index: 0}
export const getColumns = (data: any) => {
  return data.meta.columns.map((item: { name: string }) => {
    const { name } = item
    return {
      title: name,
      ellipsis: true,
      dataIndex: name,
      width: 150
    }
  })
}