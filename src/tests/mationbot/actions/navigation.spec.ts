import { Page } from 'puppeteer'

import { goTo, waitForNavigation } from '@mationbot/actions/navigation'
import { getDefaultGoToPageOptions } from '@mationbot/helpers/navigation'
import { click } from '@mationbot/actions/input'

import { BASE_URL, EXAMPLE_URL } from '@tests/urls'
import { FORM_SUBMIT_BUTTON_SELECTOR } from '@tests/selectors'

/**
 * @description   Navigation Action Factory
 *                The factory methods here return BotAction's for the bots to input into the page as User
 *                  ie goto, waiting for navigation to complete on change
 */
describe('[MationBot:Action Factory] Navigation', () => {
  const mockPage = {
    goto: jest.fn(),
    url: jest.fn(() => BASE_URL),
    waitForNavigation: jest.fn()
  }

  beforeAll(async() => {
    await page.goto(BASE_URL, getDefaultGoToPageOptions())
  })

  //
  // Basic Integration Tests
  it('should call puppeteer\'s page goto() method with the provided options', async() => {
    await goTo(EXAMPLE_URL)(mockPage as any as Page)

    expect(mockPage.url).toBeCalled() // are we checking the URL before requesting to go to it to prevent unnecessary requests?
    expect(mockPage.goto).toBeCalledWith('http://localhost:8080/example.html', getDefaultGoToPageOptions()) // are we providing default options, is the action relaying the correct url
  })

  it('should call puppeteer\'s waitForNavigation() method', async() => {    
    await waitForNavigation()(mockPage as any as Page)

    expect(mockPage.waitForNavigation).toBeCalled()
  })

  //
  // Unit test for both actions. Moving forward, we can rely more in Integration tests for some of these
  it('should go to example page, submit form, wait for navigation, then be on the success page', async() => {
    await goTo(EXAMPLE_URL)(page)

    // do both at the same time, so we wait for navigation to complete based on the form, 
    // and not after it's already done, which was stalling the test
    await Promise.all([
      click(FORM_SUBMIT_BUTTON_SELECTOR)(page),
      waitForNavigation()(page)
    ])

    await expect(page.title()).resolves.toMatch('Testing: Form Submit Success')
  })
})
