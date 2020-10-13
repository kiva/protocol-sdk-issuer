
  module.exports = async page => {
    await page.waitForSelector('.accept');
    await page.click('.accept');
    await page.click('#select-auth-method');
    await page.type('[name="inputId"]', 'BROOKLYN');
  }



