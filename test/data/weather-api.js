// proxymock: GET /weather\.[a-z]{2}\.com\/api/
// proxymock-disable: false
// 正则示例

module.exports = async function(req, res, rawData) {
  return { feeling: 'cool', temperature: 22, desc: '秋高气爽' };
};
