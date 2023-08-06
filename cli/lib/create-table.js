import Table from 'cli-table3'
import isSet from 'bajo/boot/helper/is-set.js'
import { map, snakeCase, capitalize, isEmpty, isArray, forOwn, isPlainObject, keys, isDate } from 'lodash-es'

const defTitleFn = (text = '') => {
  return map(snakeCase(text).split('_'), t => capitalize(t)).join(' ')
}

export function vertical (obj, opts) {
  const titleFn = isSet(opts.titleFn) ? opts.titleFn : defTitleFn
  const { print = true, style = { head: [] } } = opts || {}
  if (isEmpty(obj)) return
  const tbl = new Table({
    style
  })
  forOwn(obj, (v, k) => {
    if (isArray(v)) {
      if (isPlainObject(v[0])) v = horizontal(v, { print: false, titleFn })
      else v = v.join(', ')
    } else if (isPlainObject(v)) {
      v = vertical(v, { print: false, titleFn })
    }
    if (isDate(v)) v = v.toISOString()
    const item = {}
    item[titleFn ? titleFn(k) : k] = v
    tbl.push(item)
  })
  const text = tbl.toString()
  return print ? console.log(text) : text
}

export function horizontal (coll, opts) {
  const titleFn = isSet(opts.titleFn) ? opts.titleFn : defTitleFn
  const { print = true, noHeader, style = { head: [] } } = opts || {}
  if (isEmpty(coll)) return
  const head = keys(coll[0])
  const tbl = new Table({
    head: noHeader ? [] : map(head, h => titleFn ? titleFn(h) : h),
    style
  })
  for (const c of coll) {
    const items = []
    for (const h of head) {
      let item = c[h]
      if (isPlainObject(item)) item = vertical(item, { print })
      if (isDate(item)) item = item.toISOString()
      if (isArray(item)) item = isPlainObject(item[0]) ? horizontal(item, { print }) : item.join(', ')
      items.push(item)
    }
    tbl.push(items)
  }
  const text = tbl.toString()
  return print ? console.log(text) : text
}
