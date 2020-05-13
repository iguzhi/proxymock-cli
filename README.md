# proxymock-cli
proxymock-cli

## how to use?

* 安装 `yarn global add proxymock-li` 或 `npm install proxymock-cli -g`

* 执行 `proxymock -d <mock data directory> [-s]`

```
  -d: mock数据文件存放目录
  -s: 是否设置系统代理为proxymock代理服务器的ip和端口
```

## mock文件指令规则

* 以单行注释语法`//`作为mock文件规则的指令, 指令不支持多行注释语法`/**/`

* `// proxymock: [^] <GET|POST|PUT> <https://weather.qq.com/api/shanghai.do>` 此指令必选; 指令中`<>`表示必填, `[]`表示选填, `|`表示多选一

* `// proxymock-disable: [true|false]` 此指令可选

## mock文件示例

```
  // proxymock: ^ GET https://weather.qq.com/api/shanghai.do
  // proxymock-disable: false

  module.exports = {
    desc: '艳阳当空、烈日炎炎',
    temperature: 38,
    feeling: 'hot'
  }
```

```
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
```

## 运行截图
![](https://github.com/iguzhi/proxymock-cli/blob/master/img/proxymock.png)

## 参考资料

[nodejs动态加载代码](https://blog.csdn.net/qq_39807732/article/details/88087348)
