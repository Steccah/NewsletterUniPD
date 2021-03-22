const puppeteer = require('puppeteer');//headless browser emulator
const config = require('./config')

async function speedup(page){
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        if (request.resourceType() === 'image') request.abort();
        else if (request.resourceType() === 'media') request.abort();
        else if (request.resourceType() === 'font') request.abort();
        else if (request.resourceType() === 'stylesheet') request.abort();
        else request.continue();
    });
}

async function main(){
    //lancia puppeteer senza "grafica" e in incognito
    const browser = await puppeteer.launch({headless: false, args: [`--incognito`]});
    const pages = await browser.pages();
    const page = pages[0];

    await speedup(page);
    page.setViewport({ width: 900, height: 900 });
    await page.goto(config.newsletter, {
        waitUntil: 'networkidle2',
    });

    await page.$$eval("input[type='checkbox']", checks => checks.forEach(c => c.checked = false));
    await page.click('.btn-save');
}

main();