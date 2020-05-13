// proxymock: GET http://www.weather.cn/api

/**
 * req: 可用 { query, params, body, header } 等参数作为条件导出不同mock数据
 * res: 可用 .json(), .end() 等方法回传mock数据
 */
module.exports = async function(req, res, rawData) {
  await new Promise(resolve => setTimeout(() => resolve(), 3000)); // 模拟请求延迟3秒

  if (req.query.type === 'hot') {
    return {
      desc: '艳阳当空、烈日炎炎',
      temperature: 38,
      feeling: 'hot'
    };
  }
  
  if (req.query.type === 'cold') {
    res.json({
      desc: '大雪纷飞、寒风刺骨',
      temperature: -25,
      feeling: 'cold'
    });
  }
};
