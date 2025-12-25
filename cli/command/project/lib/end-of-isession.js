import select, { Separator } from '@inquirer/select'
import { __ } from '../../../lib/translate.js'

async function endOfISession () {
  const answer = await select({
    message: __('End of interactive session. Continue?'),
    choices: [
      { value: 'y', name: __('Yes, continue') },
      { value: 'n', name: __('No, abort') },
      new Separator(),
      { value: 'e', name: __('Back to edit') }
    ]
  })
  return answer
}

export default endOfISession
