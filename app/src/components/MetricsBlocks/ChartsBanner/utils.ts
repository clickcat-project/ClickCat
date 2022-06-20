import { DataDecorator } from "services";

export const dealWithLineData = (res: DataDecorator) => {
  let category = ''
  if (res.meta.columns.length > 2) {
    category =  res.meta.columns[1].name
  }
  let nameCol = ''
  let valueCol = ''
  res.meta.columns.forEach((col) => {
    if (col.index === 0) {
      nameCol = col.name;
    } else {
      valueCol = col.name;
    }
  });
  if (category === 'read_rows') {
    const firstName = res.meta.columns[1].name
    const secondName = res.meta.columns[2].name
    return [
      res.rows.map(item => {
        return {
          category: res.meta.columns[1].name,
          name: item[nameCol],
          value: item[firstName]
        }
      }),
      res.rows.map(item => {
        return {
          category: res.meta.columns[2].name,
          name: item[nameCol],
          value: item[secondName]
        }
      })
    ]
  } else {
    const categoryObj = {}
    res.rows.forEach(item => {
      categoryObj[item[category]] = 1
    })
    const categoryList = Object.keys(categoryObj)
    return categoryList.map(cate => {
      return res.rows.map(row => {
        return {
          name: row[nameCol],
          category: cate,
          value: cate === row[category] ? row[valueCol] : 0
        }
      })
    })
  }
}