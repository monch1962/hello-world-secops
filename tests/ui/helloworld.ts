import { Selector } from 'testcafe';

fixture `Homepage`
    .page `http://localhost:8080/`;

test('Test helloworld content on homepage', async t => {
    await t
        .expect(Selector('html').innerText).contains('hello world!')
        .takeScreenshot()
});