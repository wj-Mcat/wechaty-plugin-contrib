import {
  log,
  Contact,
  Wechaty,
}             from 'wechaty'

type ContactFinderOption        = string | RegExp
export type ContactFinderOptions = ContactFinderOption | ContactFinderOption[]

type ContactFinderFunction = (wechaty: Wechaty) => Contact[] | Promise<Contact[]>

export function contactFinder (options?: ContactFinderOptions): ContactFinderFunction {
  log.verbose('WechatyPluginContrib', 'contactFinder(%s)', JSON.stringify(options))

  if (!options) {
    return () => []
  }

  if (!Array.isArray(options)) {
    options = [ options ]
  }

  const optoinList = options

  return async function contactFind (wechaty: Wechaty): Promise<Contact[]> {
    log.silly('WechatyPluginContrib', 'contactFinder() contactFind(%s)', wechaty)

    const allContactList: Contact[] = []

    for (const option of optoinList) {
      if (typeof option === 'string') {
        allContactList.push(wechaty.Contact.load(option))
      } else if (option instanceof RegExp) {
        allContactList.push(...await wechaty.Contact.findAll({ name: option }))
        allContactList.push(...await wechaty.Contact.findAll({ alias: option }))
      } else {
        throw new Error('option is unknown: ' + option)
      }
    }

    const dedupedContactList = [...new Set(allContactList.filter(Boolean))]
    return dedupedContactList
  }
}