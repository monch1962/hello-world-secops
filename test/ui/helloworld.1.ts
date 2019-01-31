import { Selector, ClientFunction } from 'testcafe';
//import uaParser from 'ua-parser-js';
import { Guid } from 'guid-typescript';

fixture `Homepage`
    .page `http://localhost:8080/`;

//Returns a user-agent header sent by the browser
//const getUA = ClientFunction(() => navigator.userAgent);

test('Test helloworld content on homepage', async t => {
    //const ua = await getUA();
    //const browserEngineName = uaParser(ua).browser.engine.name
    //const timestamp = Date.now().toString();
    const guid = Guid.create();
    await t
        .expect(Selector('html').innerText).contains('hello world!')
        .takeScreenshot(guid + '.png')
});