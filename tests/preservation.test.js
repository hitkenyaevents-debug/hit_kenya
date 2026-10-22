import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const dir = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, dir), 'utf8');

test('original supplied HTML remains unchanged and new photo navigation is narrowly scoped', () => {
  const original = read('ORIGINAL-UNMODIFIED.html');
  const homepage = read('public/index.html');
  assert.match(original, /openServiceDetail\('media'\)/);
  assert.equal((homepage.match(/onclick="openHitPhotography\(\)"/g)||[]).length,2);
  assert.equal((homepage.match(/event.stopPropagation/g)||[]).length,2);
  assert.equal((homepage.match(/onclick="openServiceDetail\('media'\)"/g)||[]).length,0);
  assert.match(homepage,/assets\/hit-kenya-paystack-addon\.js/);
  const front=read('public/photography.html');
  const portfolio=read('public/photography-portfolio.html');
  assert.match(front,/CAPTURE\. CREATE\./);
  assert.match(front,/photography-portfolio\.html/);
  assert.doesNotMatch(front,/PAST EVENTS &amp; PROJECTS/);
  assert.match(portfolio,/PAST EVENTS &amp; PROJECTS/);
  assert.match(portfolio,/href="photography\.html"/);
  assert.match(homepage,/openPartnerFlow\('media'\)/);
  assert.match(homepage,/hk-photo-front-template/);
  assert.match(homepage,/hk-photo-portfolio-template/);
  assert.match(homepage,/frame.srcdoc=tpl.innerHTML/);
});

test('extra checkout script uses selected size and preserves the existing cart handler', () => {
  const called=[];
  const cart=[{name:'HIT KENYA T-Shirt',size:'XL',price:1500,qty:1}];
  const window={addToCart(...args){called.push(args)},showNotice(){}};
  vm.runInNewContext(read('public/assets/hit-kenya-paystack-addon.js'), {window,document:{getElementById(){}},hkCart:cart,fetch(){},console});
  window.addToCartSelected({closest(){return {querySelector(){return {textContent:'XL'}}}}},'HIT KENYA T-Shirt',1500);
  assert.deepEqual(called,[['HIT KENYA T-Shirt',1500,'XL']]);
  assert.equal(cart[0].id,'tshirt');
});
