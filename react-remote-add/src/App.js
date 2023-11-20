import "./App.css";

import {useState,useRef} from 'react';

const NumsStrPattern = /^[\d,]+$/;

const addRemote = async (a, b) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(a + b), 100);
  });

// 请实现本地的add方法，调用 addRemote，能最优的实现输入数字的加法。
async function add(...inputs) {

  // 你的实现
  if(inputs.length === 1) return inputs[0];
  // 将input 变为[[x,y],[i,j]] 形式的数组

  const numsList = inputs.reduce((a,b) => {
    if(a.length === 0) {
      return [[b]]
    }else if(a[a.length - 1].length === 1) {
      return [...a.slice(0,a.length - 1),[...a[a.length - 1],b]]
    }else if(a[a.length - 1].length === 2) {
      return [...a, [b]];
    }
  },[])

  try{
    return await add(...await Promise.all(numsList.map(async l=>{
      return l.length === 1 ? l[0] : (await addRemote(l[0],l[1]))
    })))
  }catch(e) {
    throw e;
  }
}

/**
 * 要求：a
 * 1. 所有的加法都必须使用addRemote
 * 2. 输入错误时，input边框需要变红，Button disable
 * 3. 计算过程 Button与input disable, Button 展示计算中...
 * 3. 计算时间越短越好
 */
function App() {
  const [loading,setLoading] = useState(false);
  const [isError,setIsError] = useState(false);

  const [result,setResult] = useState({
    num: 0,
    time: 0,
  });

  const inputRef = useRef(null);

  const handleAdd = async () => {
    // 验证代码

    const text = inputRef.current?.value.trim();

    if(!text || isError) {
      return;
    }
    const nums = text.split(',').filter(i=>i.trim()).map(i=>parseInt(i));

    try{
      const startTime = performance.now();
      setLoading(true);
      const num = await add(...nums);

      setResult({
        num,
        time: performance.now() - startTime,
      })
    }catch(e) {
      setIsError(true);
      setResult({
        num: -1,
        time: 0
      })
    }finally{
      setLoading(false);
    }
  };

  const handleJudgeText = (e) => {
    setIsError(!NumsStrPattern.test(e.target.value))
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          请实现 App.js 中 add 方法，当用户在输入框中输入多个数字(逗号隔开)时，
          <br />
          点击相加按钮能显示最终结果，并给出计算时间
        </p>
        <div>
          用例：2, 3, 3, 3, 4, 1, 3, 3, 5, 6, 1, 4, 7 ={">"} 38，最慢1200ms
        </div>
      </header>
      <section className="App-content">

        <input
          type="text"
          placeholder="请输入要相加的数字（如1,4,3,3,5）"
          ref={inputRef}
          onChange={handleJudgeText}
          style={isError ? {
            borderColor: "red"
          }: undefined}/>

          <button onClick={handleAdd} disabled={isError}>{loading ? "计算中...": "相加"}</button>
      </section>
      <section className="App-result">
        <p>
          相加结果是：
          {result.num}， 计算时间是：{result.time} ms
        </p>
      </section>
    </div>
  );
}

export default App;
