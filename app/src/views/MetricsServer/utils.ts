import moment from 'moment'

export const getUndefined = (val: string[] | undefined) => {
  return val?.includes('All') ? undefined : val
}

export const getRealSqlOfArr = (val: string[] | undefined) => {
  if (!val) {
    return val
  }
  // ('COLUMNS','SCHEMATA')
  // const addMarksVal = val.map(str => `'${str}'`)
  // return `(${addMarksVal.join(',')})`
  return `'${val}'`
}

export const isType = (val: any) => {
  return Object.prototype.toString.call(val)
}

export const isNumber = (val: any) => {
  const typeStr = isType(val)
  return typeStr === '[object Number]'
}

export const isString = (val: any) => {
  const typeStr = isType(val)
  return typeStr === '[object String]'
}

const formatStr = 'YYYY-MM-DD HH:mm:ss'

export const getStartAndEndTime = (time: string | number) => {
  // 2022-01-10 00:00:00
  const isNum = isNumber(time)
  const isStr = isNumber(time)
  const current = moment().valueOf()
  if (isNum) {
    return [
      moment(current - (+time)).format(formatStr),
      moment().format(formatStr)
    ]
  } else if (isStr) {
    const [start, end] = (time as string).split(',')
    let endTime = end
    if (end === '?') {
      endTime = moment().format(formatStr)
    }
    return [start, endTime]
  }
  return []
}