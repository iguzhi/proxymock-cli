# proxymock-cli
proxymock-cli

## how to use?

* 安装 `yarn global add proxymock-li` 或 `npm install proxymock-cli -g`

* 执行 `proxymock -d <mock data directory> [-s] [-l <log level>]`

```
  -d: mock数据文件存放目录, <必填>
  -s: 是否设置系统代理为proxymock代理服务器的ip和端口, [选填]
  -l: 日志级别, 默认级别`info`, 可选级别项: `debug`、`info`、`warn`、`error`, [选填]
```
* 日志打印目录为操作系统登录用户目录下的`.proxymock`文件夹, windows系统如 `C:\Users\your-pc-name\.proxymock`

## mock文件指令规则

* 以单行注释语法 `//` 作为mock文件规则的指令, 指令不支持多行注释语法 `/**/`

* `// proxymock: [^] <GET|POST|PUT|DELETE> <url>` 此指令必选; 指令中`<>`表示必填, `[]`表示选填, `|`表示多选一

* `// proxymock-disable: [true|false]` 此指令可选

* `<url>` 部分支持正则表达式

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

```
  // proxymock: GET /weather\.[a-z]{2}\.com\/api/
  // proxymock-disable: false
  // 正则示例

  module.exports = async function(req, res, rawData) {
    return { feeling: 'cool', temperature: 22, desc: '秋高气爽' }；
  };
```

## 运行截图
![](https://github.com/iguzhi/proxymock-cli/blob/master/img/proxymock.png)

## CA根证书生成与信任

运行 `proxymock -d <mock data directory> [-s] [-l <log level>]` 时, 会检测root CA证书是否存在, 若不存在会提醒生成证书. 也可以在启动代理服务器前主动生成证书并信任之.(根证书在一台电脑上通常只需要生成一次)

* 运行 `proxymock-ca -r` 生成根证书, 会打印出生成的证书文件路径

* 信任证书: windows系统需要手动导入上一步生成的根证书; MAC可运行 `proxymock-ca -t` 尝试导入信任

* 查看系统的根证书列表是否包含名为 **DO NOT TRUST PROXYMOCK ROOT CA** 的根证书, 若存在说明信任成功

## 参考资料

[nodejs动态加载代码](https://blog.csdn.net/qq_39807732/article/details/88087348)
