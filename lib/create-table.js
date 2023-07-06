import Table from 'cli-table3'
import _ from 'lodash'

export function vertical (obj, { print = true, titleFn = _.capitalize } = {}) {
  if (_.isEmpty(obj)) return
  const tbl = new Table({
    style: { head: [] }
  })
  _.forOwn(obj, (v, k) => {
    tbl.push(_.set({}, titleFn ? titleFn(k) : k, v))
  })
  if (print) {
    console.log(tbl.toString())
    return
  }
  return tbl
}

export function horizontal (coll, { print = true, titleFn = _.capitalize } = {}) {
  if (_.isEmpty(coll)) return
  const head = _.keys(coll[0])
  const tbl = new Table({
    head: _.map(head, h => titleFn ? titleFn(h) : h),
    style: { head: [] }
  })
  for (const c of coll) {
    let item = []
    for (const h of head) {
      item.push(c[h])
    }
    tbl.push(item)
  }
  if (print) {
    console.log(tbl.toString())
    return
  }
  return tbl
}
