const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless : false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    await page.goto('https://hifutsal.com/bbs/reservation.php');
    const tr = await page.$$eval('#tableId > tbody > tr', (data) => data.length);

    let data = [];
    for (let i = 1; i <= tr; i++) {
        data.push(await getAllHref(page, i));
    }

    for (let e in data) {
        if(typeof data[e].name != 'undefined') {
            await page.goto(data[e].name);
            if((await page.$('.ctt_list > div:nth-child(2) > ul > li:nth-child(2) > input')) === null ) {
                continue;
            }
            await page.click('.ctt_list > div:nth-child(2) > ul > li:nth-child(2) > input');
            await page.click('#checkbox_search > div.ctt_bt > input');
            await page.waitForTimeout(500)
            await page.$eval('#ctt_txtbox1', el => el.value = '노대성');
            await page.$eval('#ctt_txtbox2', el => el.value = '양발의족');
            await page.$eval('#ctt_txtbox3_1', el => el.value = '9921');
            await page.$eval('#ctt_txtbox3_2', el => el.value = '1136');
            await page.$eval('#ctt_txtbox5', el => el.value = '4080');
            await page.click('#check_ok');
            await page.click('#check_priv');
            await page.click('#fregister > div > input');
            await page.waitForTimeout(500)
        }
    }
    // await browser.close();
})();

async function getAllHref(page, index)
{
    let data = {};
    let temp = await page.$('#tableId > tbody > tr:nth-child(' + index + ') > td:nth-child(1) > a');
    data.name = await page.evaluate((data) => {
        if (data !== null) return data.href;
    }, temp);

    return data;
}
