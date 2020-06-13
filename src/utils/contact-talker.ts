import {
  Contact,
  log,
}                 from 'wechaty'

type ContactTalkerFunction      = (contact: Contact) => void | Promise<void>
type ContactTalkerOption        = string | ContactTalkerFunction
export type ContactTalkerOptions = ContactTalkerOption | ContactTalkerOption[]

export function contactTalker (options?: ContactTalkerOptions) {
  log.verbose('WechatyPluginContrib', 'contactTalker(%s)', JSON.stringify(options))

  if (!options) {
    return () => undefined
  }

  if (!Array.isArray(options)) {
    options = [ options ]
  }

  const optoinList = options

  return async function contactTalk (contact: Contact): Promise<void> {
    log.silly('WechatyPluginContrib', 'contactTalker() contactTalk(%s)', contact)

    for (const option of optoinList) {
      if (typeof option === 'string') {
        await contact.say(option)
      } else if (option instanceof Function) {
        await option(contact)
      } else {
        throw new Error('contactTalk optoin unknown: ' + option)
      }
      await contact.wechaty.sleep(5 * 1000)
    }
  }
}