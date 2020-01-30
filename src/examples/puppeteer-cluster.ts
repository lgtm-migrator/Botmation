require("module-alias/register")

import { Cluster } from 'puppeteer-cluster'
import { Page } from 'puppeteer'

// Actions
import { goTo } from '@mationbot/actions/navigation'
import { screenshot } from '@mationbot/actions/output'
import { logError } from '@mationbot/actions/console'

// Class for injecting the page
import { MationBot } from '@mationbot'

// Purely functional approach
import { BotActionsChainFactory as Bot } from '@mationbot/factories/bot-actions-chain.factory'

(async () => {
    try {
        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_BROWSER, // browser / page, Incognito mode
            maxConcurrency: 3 // max number of bots
        })
    
        // We don't define a task and instead use own functions
        const nodeJsBot = async ({ page, data: url }: {page: Page, data: any}) => {
            // Functional
            await Bot(page)(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_'))
            )
        }
    
        const githubBot = async ({ page, data: url }: {page: Page, data: any}) => {
            // Imperative OO
            const bot = new MationBot(page);
    
            await bot.actions(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_'))
            )
        }
    
        const typescriptBot = async ({ page, data: url }: {page: Page, data: any}) => {
            const bot = new MationBot(page);
    
            await bot.actions(
                goTo(url),
                screenshot(url.replace(/[^a-zA-Z]/g, '_'))
            )
        }
    
        // Run the bots
        cluster.queue('https://nodejs.org/', nodeJsBot)
        cluster.queue('https://github.com/', githubBot)
        cluster.queue('https://www.typescriptlang.org/', typescriptBot)
    
        // Wait for it to finish up
        await cluster.idle()
        await cluster.close()
    } catch(error) {
        logError(error)
    }
})()