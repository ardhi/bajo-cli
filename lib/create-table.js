import Table from 'cli-table3'
import _ from 'lodash'

const defTitleFn = (text = '') => {
  return _.map(_.snakeCase(text).split('_'), t => _.capitalize(t)).join(' ')
}

export function vertical (obj, opts) {
  const { print = true, titleFn = defTitleFn, style = { head: [], border: [] } } = opts || {}
  if (_.isEmpty(obj)) return
  const tbl = new Table({
    style
  })
  _.forOwn(obj, (v, k) => {
    if (_.isArray(v)) {
      if (_.isPlainObject(v[0])) v = horizontal(v, { print: false })
      else v = v.join(', ')
    }
    tbl.push(_.set({}, titleFn ? titleFn(k) : k, v))
  })
  const text = tbl.toString()
  return print ? console.log(text) : text
}

export function horizontal (coll, opts) {
  const { print = true, titleFn = defTitleFn, noHeader, style = { head: [], border: [] } } = opts || {}
  if (_.isEmpty(coll)) return
  const head = _.keys(coll[0])
  const tbl = new Table({
    head: noHeader ? [] : _.map(head, h => titleFn ? titleFn(h) : h),
    style,
  })
  for (const c of coll) {
    let item = []
    for (const h of head) {
      item.push(c[h])
    }
    tbl.push(item)
  }
  const text = tbl.toString()
  return print ? console.log(text) : text
}
