import { Page } from 'puppeteer'

import { BotAction } from '@mationbot/interfaces/bot-action.interfaces'
import { BotActionsChainFactory } from '@mationbot/factories/bot-actions-chain.factory'

/**
 * 
 * @param page 
 * @param actions 
 */
export const applyBotActionOrActions = async(page: Page, actions: BotAction[] | BotAction) => {
  if (Array.isArray(actions)) {
    await BotActionsChainFactory(page)(...actions)
  } else {
    await BotActionsChainFactory(page)(actions)
  }
}