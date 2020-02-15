/**
 * @description  Simple Example Script
 */
import puppeteer from 'puppeteer'
import { BotActionsChainFactory as Bot } from 'botmation'

// General BotAction's
import { log } from 'botmation/actions/console'
import { goTo } from 'botmation/actions/navigation'
import { screenshot } from 'botmation/actions/output'
import { logError } from 'botmation/helpers/console'

(async () => {
  let browser: puppeteer.Browser

  try {
    // Get the Browser from Puppeteer
    browser = await puppeteer.launch({headless: false}) // {headless: false} shows the browser, run in headless if you don't care to see

    // Grab a Page from the Browser for the bot to operate in
    const pages = await browser.pages()
    const page = pages.length === 0 ? await browser.newPage() : pages[0]

    // Run the chain of actions
    await Bot(page)(
      log('Bot running'),
      goTo('https://google.com'),
      screenshot('google-homepage-fn'),
      log('Screenshot taken')
    )
    
    // close the page when you're done
    await page.close()
  } catch (error) {
    logError(error)
    
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  } finally {
    // close the browser when done
    setTimeout(async() => {
      if (browser) await browser.close()
    })
  }
  
})()