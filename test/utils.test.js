const { Builder, until } = require('selenium-webdriver')
const assert = require('assert')

const { encodeToken, decodeToken } = require('../src/utils')

describe('utils', () => {
  let driver
  before(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .usingServer('http://selenium:4444/wd/hub')
      .build()
    await driver.get('http://app.local:8080/test.html')
    return driver
  })
  const SIMPLE_OBJECT = { a: 'yes', b: 'no' }
  const ENCODED_OBJECT = 'eyJhIjoieWVzIiwiYiI6Im5vIn0'
  describe('encodeToken', () => {
    it('should encode object into websafe base64', async () => {
      const encodedToken = await driver.executeScript(`
        const encodeToken = ${encodeToken.toString()};
        return encodeToken(${JSON.stringify(SIMPLE_OBJECT)})
        `)
      assert.equal(encodedToken, ENCODED_OBJECT)
    })
  })
  describe('decodeToken', () => {
    it('should decode a string into an object', async () => {
      const simpleToken = await driver.executeScript(`
      const decodeToken = ${decodeToken.toString()};
      return decodeToken("${ENCODED_OBJECT}")
      `)
      assert.deepEqual(simpleToken, SIMPLE_OBJECT)
    })
  })
})
