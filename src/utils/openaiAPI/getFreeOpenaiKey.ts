// Filter out non-technical users
export function getFreeOpenaiKey() {
  const key_1 = 'c2stT2VSYXZVMDJMZ3dDUFBSeGJkZ2RUM0JsYmtGSnN2THo2MzBTRzRuNm1xQlo3UnRT';
  const key_2 = 'c2staVVHQXg5aGVHS2Jmb3RpTFpmdHJUM0JsYmtGSnExRENYM3M4aWE2U1Q3YjRlWjZE';

  const key = Math.random() > 0.5 ? key_1 : key_2;
  return Buffer.from(key, 'base64').toString('utf-8');
}
