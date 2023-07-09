import { horizontal, vertical } from '../../lib/create-table.js'

async function prettyPrint (obj, print = false) {
  const { importPackage } = this.bajo.helper
  const _ = await importPackage('lodash::bajo')
  let result
  if (_.isString(obj) || _.isNumber(obj)) result = horizontal([{ obj }], { print, noHeader: true })
  else if (_.isArray(obj)) result = horizontal(obj, { print })
  else result = vertical(obj, { print })
  if (!print) return result
}

export default prettyPrint
