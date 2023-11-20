import './App.css';
import { useState, useEffect,useRef } from 'react';

const MapPorts = {
  "https": "443",
  "http": "80",
  "ws": "80",
  "wss": "443"
}

const defaultParserResult = {
  protocol: '',
  hostname: '',
  port: '',
  pathname: '',
  params: {},
  hash: ''
}

function isUrl(str) {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // 协议部分（可选）
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // 域名部分
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // 或者 IP 地址部分（例如：127.0.0.1）
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // 端口和路径部分
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // 查询参数部分
    '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  return urlPattern.test(str);
}

const parserUrl = (url) => {
  if(!isUrl(url)) return false;
  const parser = document.createElement('a');
  parser.href = url;

  const protocol = parser.protocol;
  const hostname = parser.hostname;
  const port = parser.port || MapPorts[protocol];
  const pathname = parser.pathname;
  const search = parser.search;
  const hash = parser.hash;

  // Parsing the search parameters
  const params = {};
  const searchParams = new URLSearchParams(search);
  for (let [key, value] of searchParams) {
    params[key] = value;
  }

  return {
    protocol,
    hostname,
    port,
    pathname,
    params,
    hash
  };
}

// 测试用例
console.log(parserUrl('https://baidu.com:443/s?wd=hello'))
// 输出结果：{ protocol: 'https:', hostname: 'baidu.com', port: '443', pathname: '/s', params: { wd: 'hello' },  hash: '' }



function App() {
  const [result, setResult] = useState(defaultParserResult);
  const inputRef = useRef();


  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.keyCode === 13) {
        const result = parserUrl(e.target.value);
        if(!result) {
          alert("请输入一个url")
          return;
        }
        setResult(result);
      }
    }
    document.addEventListener('keydown', onKeyDown, false);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, []);


  const handleClickParse = () => {
    const text = inputRef.current.value;
    const result = parserUrl(text);
        if(!result) {
          alert("请输入一个url")
          return;
        }
        setResult(result);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>请实现 App.js 中 parserUrl 方法，当用户在输入框中输入url时，</div>
        <div>点击解析按钮（或者按 enter 快捷键）能够识别出 url 各个组成部分</div>
        <div>并将结果渲染在页面上（tips: 请尽可能保证 parserUrl 的健壮性和完备性）</div>
      </header>
      <section className="App-content">
        <input type="text" placeholder="请输入 url 字符串" ref={inputRef}/>
        <button id="J-parserBtn" onClick={handleClickParse}>解析</button>
      </section>
      <section className="App-result">
        <h2>解析结果</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </section>
    </div>
  );
}

export default App;
