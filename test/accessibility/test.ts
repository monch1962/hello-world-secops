import axeCheck from 'axe-testcafe';

fixture `Accessibility testing`
    .page `http://localhost:8080/`;

test('Automated accessibility testing', async t => {
    await axeCheck(t);
});