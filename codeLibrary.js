// codeLibrary_100_snippets.js
// A 100-snippet programming reference (readable, commented)

/**
 * Exported object `codeLibrary` maps snippet IDs to snippet objects:
 * { keywords: [...], language: 'javascript'|'python'|..., code: `...` }
 *
 * This file is intentionally verbose and educational (comments + examples).
 */

export const codeLibrary = {
  // ---------------- Python (1-20) ----------------
  pythonHelloWorld: {
    keywords: ['python', 'hello world', 'print'],
    language: 'python',
    code: `print("Hello, World!")`
  },
  pythonVariables: {
    keywords: ['python', 'variables', 'assign'],
    language: 'python',
    code: `# variables and types
x = 10
name = "Alice"
pi = 3.14159
print(x, name, pi)`
  },
  pythonIfElse: {
    keywords: ['python', 'if', 'conditional'],
    language: 'python',
    code: `x = 5
if x > 0:
    print('positive')
else:
    print('non-positive')`
  },
  pythonForLoop: {
    keywords: ['python', 'for', 'loop', 'iterate'],
    language: 'python',
    code: `for i in range(5):
    print(i)`
  },
  pythonWhileLoop: {
    keywords: ['python', 'while', 'loop'],
    language: 'python',
    code: `n = 3
while n > 0:
    print(n)
    n -= 1`
  },
  pythonListComprehension: {
    keywords: ['python', 'list comprehension', 'map'],
    language: 'python',
    code: `nums = [1,2,3,4]
squares = [x*x for x in nums]
print(squares)`
  },
  pythonDictLoop: {
    keywords: ['python', 'dict', 'dictionary', 'loop'],
    language: 'python',
    code: `d = {'a':1,'b':2}
for k,v in d.items():
    print(k, v)`
  },
  pythonFunctions: {
    keywords: ['python', 'function', 'def'],
    language: 'python',
    code: `def greet(name):
    return f"Hello, {name}!"
print(greet('Sam'))`
  },
  pythonLambda: {
    keywords: ['python', 'lambda', 'anonymous'],
    language: 'python',
    code: `add = lambda a,b: a+b
print(add(2,3))`
  },
  pythonOOPClass: {
    keywords: ['python', 'class', 'oop', 'object'],
    language: 'python',
    code: `class Person:
    def __init__(self, name):
        self.name = name
    def greet(self):
        print(f"Hi, I'm {self.name}")

p = Person('Ana')
p.greet()`
  },
  pythonFileRead: {
    keywords: ['python', 'file', 'read', 'open'],
    language: 'python',
    code: `with open('input.txt','r') as f:
    text = f.read()
print(text)`
  },
  pythonFileWrite: {
    keywords: ['python', 'file', 'write', 'save'],
    language: 'python',
    code: `with open('out.txt','w') as f:
    f.write('Hello file')`
  },
  pythonException: {
    keywords: ['python', 'try', 'except', 'error'],
    language: 'python',
    code: `try:
    x = 1/0
except ZeroDivisionError:
    print('div by zero')`
  },
  pythonRequestsGet: {
    keywords: ['python', 'requests', 'http', 'api'],
    language: 'python',
    code: `# requires: pip install requests
import requests
r = requests.get('https://api.github.com')
print(r.status_code, r.json())`
  },
  pythonJson: {
    keywords: ['python', 'json', 'serialize'],
    language: 'python',
    code: `import json
data = {'a':1}
print(json.dumps(data))`
  },
  pythonListSort: {
    keywords: ['python', 'sort', 'list'],
    language: 'python',
    code: `arr = [3,1,2]
arr.sort()
print(arr)`
  },
  pythonGenerators: {
    keywords: ['python', 'generator', 'yield'],
    language: 'python',
    code: `def gen(n):
    for i in range(n):
        yield i*i
for x in gen(5):
    print(x)`
  },
  pythonDatetime: {
    keywords: ['python', 'datetime', 'time'],
    language: 'python',
    code: `from datetime import datetime
now = datetime.now()
print(now.strftime('%Y-%m-%d %H:%M:%S'))`
  },

  // ---------------- JavaScript (21-50) ----------------
  javascriptHelloWorld: {
    keywords: ['javascript', 'hello world'],
    language: 'javascript',
    code: `console.log('Hello, World!');`
  },
  javascriptVariables: {
    keywords: ['javascript', 'var', 'let', 'const'],
    language: 'javascript',
    code: `let x = 5;
const name = 'Bob';
console.log(x, name);`
  },
  javascriptFunction: {
    keywords: ['javascript', 'function', 'arrow'],
    language: 'javascript',
    code: `const add = (a,b) => a + b;
console.log(add(2,3));`
  },
  javascriptAsyncAwait: {
    keywords: ['javascript', 'async', 'await', 'promise'],
    language: 'javascript',
    code: `async function fetchJson(url) {
  const res = await fetch(url);
  return res.json();
}
fetchJson('https://api.github.com').then(console.log);`
  },
  javascriptPromise: {
    keywords: ['javascript', 'promise', 'then'],
    language: 'javascript',
    code: `new Promise((resolve) => setTimeout(() => resolve(42), 1000))
  .then(val => console.log(val));`
  },
  javascriptDOMQuery: {
    keywords: ['javascript', 'dom', 'query', 'getElement'],
    language: 'javascript',
    code: `const el = document.querySelector('#app');
el.textContent = 'Hello DOM';`
  },
  javascriptEventListener: {
    keywords: ['javascript', 'event', 'click', 'listener'],
    language: 'javascript',
    code: `document.getElementById('btn').addEventListener('click', () => {
  alert('Clicked!');
});`
  },
  javascriptDebounce: {
    keywords: ['javascript', 'debounce', 'throttle'],
    language: 'javascript',
    code: `function debounce(fn, delay){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}`
  },
  javascriptThrottle: {
    keywords: ['javascript', 'throttle'],
    language: 'javascript',
    code: `function throttle(fn, limit){
  let inThrottle;
  return (...args) => {
    if(!inThrottle){
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}`
  },
  javascriptFetchPost: {
    keywords: ['javascript', 'fetch', 'post'],
    language: 'javascript',
    code: `fetch('/submit', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({a:1})
}).then(r => r.json()).then(console.log)`
  },
  javascriptLocalStorage: {
    keywords: ['javascript', 'localStorage', 'storage'],
    language: 'javascript',
    code: `localStorage.setItem('key','value');
console.log(localStorage.getItem('key'));`
  },
  javascriptArrayMap: {
    keywords: ['javascript', 'array', 'map'],
    language: 'javascript',
    code: `const arr = [1,2,3];
console.log(arr.map(x => x*2));`
  },
  javascriptArrayFilter: {
    keywords: ['javascript', 'filter', 'array'],
    language: 'javascript',
    code: `const arr = [1,2,3,4];
console.log(arr.filter(x => x%2===0));`
  },
  javascriptArrayReduce: {
    keywords: ['javascript', 'reduce', 'sum'],
    language: 'javascript',
    code: `const sum = [1,2,3].reduce((a,b)=>a+b,0);
console.log(sum);`
  },
  javascriptPromiseAll: {
    keywords: ['javascript', 'Promise.all', 'concurrency'],
    language: 'javascript',
    code: `Promise.all([fetch('/a'), fetch('/b')]).then(results => console.log(results));`
  },
  javascriptTryCatch: {
    keywords: ['javascript', 'try', 'catch', 'error'],
    language: 'javascript',
    code: `try{
  throw new Error('oops');
}catch(e){
  console.error(e);
}`
  },
  javascriptSetTimeout: {
    keywords: ['javascript', 'setTimeout', 'timer'],
    language: 'javascript',
    code: `setTimeout(()=> console.log('later'),1000);`
  },
  javascriptSetInterval: {
    keywords: ['javascript', 'setInterval', 'timer'],
    language: 'javascript',
    code: `const id = setInterval(()=> console.log('tick'),1000);
clearInterval(id);`
  },

  // ---------------- Node.js / Backend (51-70) ----------------
  nodejsExpressServer: {
    keywords: ['node','express','server','backend'],
    language: 'javascript',
    code: `// Express v4+ example
const express = require('express');
const app = express();
app.get('/', (req,res) => res.send('Hello Express'));
app.listen(3000, () => console.log('Listening on 3000'));`
  },
  nodejsReadFile: {
    keywords: ['node','fs','readfile'],
    language: 'javascript',
    code: `const fs = require('fs');
fs.readFile('file.txt','utf8',(err,data)=>{
  if(err) throw err;
  console.log(data);
});`
  },
  nodejsWriteFile: {
    keywords: ['node','fs','writefile'],
    language: 'javascript',
    code: `const fs = require('fs');
fs.writeFile('out.txt','Hello',(err)=>{ if(err) throw err; console.log('written')});`
  },
  nodejsEnv: {
    keywords: ['node','env','process.env'],
    language: 'javascript',
    code: `// access environment variables
console.log(process.env.PORT || 3000);`
  },
  nodejsChildProcess: {
    keywords: ['node','child_process','exec'],
    language: 'javascript',
    code: `const { exec } = require('child_process');
exec('ls -la', (err, stdout) => console.log(stdout));`
  },
  nodejsHttpRequest: {
    keywords: ['node','http','request'],
    language: 'javascript',
    code: `const https = require('https');
https.get('https://api.github.com', (res)=>{ console.log(res.statusCode); }).on('error', console.error);`
  },
  nodejsMiddleware: {
    keywords: ['node','express','middleware'],
    language: 'javascript',
    code: `function logger(req,res,next){
  console.log(req.method, req.url);
  next();
}
app.use(logger);`
  },
  nodejsJsonResponse: {
    keywords: ['node','express','json'],
    language: 'javascript',
    code: `app.get('/api', (req,res)=> res.json({ok:true}));`
  },
  nodejsCors: {
    keywords: ['node','cors','express'],
    language: 'javascript',
    code: `const cors = require('cors');
app.use(cors()); // allow all origins (dev only)`
  },
  nodejsPostHandler: {
    keywords: ['node','post','express','body-parser'],
    language: 'javascript',
    code: `app.use(express.json());
app.post('/data', (req,res)=>{
  console.log(req.body);
  res.sendStatus(200);
});`
  },

  // ---------------- HTML & CSS (71-85) ----------------
  htmlBasicPage: {
    keywords: ['html','template','basic','page'],
    language: 'html',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Page</title>
</head>
<body>
  <h1>Hi</h1>
</body>
</html>`
  },
  htmlForm: {
    keywords: ['html','form','input','submit'],
    language: 'html',
    code: `<form action="/submit" method="post">
  <label>Name: <input name="name"></label>
  <button type="submit">Send</button>
</form>`
  },
  cssCenterDiv: {
    keywords: ['css','center','flexbox'],
    language: 'css',
    code: `.center{display:flex;align-items:center;justify-content:center;height:100vh;}`
  },
  cssGridTwoColumn: {
    keywords: ['css','grid','layout'],
    language: 'css',
    code: `.grid{display:grid;grid-template-columns:1fr 2fr;gap:16px;}`
  },
  cssButtonHover: {
    keywords: ['css','button','hover'],
    language: 'css',
    code: `button{padding:8px 12px;border-radius:6px}
button:hover{transform:translateY(-2px);}`
  },
  cssResponsiveImg: {
    keywords: ['css','responsive','image'],
    language: 'css',
    code: `img{max-width:100%;height:auto;}`
  },

  // ---------------- SQL (86-93) ----------------
  sqlCreateTable: {
    keywords: ['sql','create table','schema'],
    language: 'sql',
    code: `CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE
);`
  },
  sqlInsert: {
    keywords: ['sql','insert','insert into'],
    language: 'sql',
    code: `INSERT INTO users (name,email) VALUES ('Sam','sam@example.com');`
  },
  sqlSelectWhere: {
    keywords: ['sql','select','where'],
    language: 'sql',
    code: `SELECT * FROM users WHERE email LIKE '%@example.com';`
  },
  sqlJoin: {
    keywords: ['sql','join','inner join','left join'],
    language: 'sql',
    code: `SELECT u.name, o.total FROM users u
JOIN orders o ON o.user_id = u.id;`
  },
  sqlIndex: {
    keywords: ['sql','index','performance'],
    language: 'sql',
    code: `CREATE INDEX idx_users_email ON users(email);`
  },

  // ---------------- Bash / Shell (94-98) ----------------
  bashShebang: {
    keywords: ['bash','script','shebang'],
    language: 'bash',
    code: `#!/usr/bin/env bash
# simple script
echo "Hello from bash"`
  },
  bashLoop: {
    keywords: ['bash','for','loop','shell'],
    language: 'bash',
    code: `for i in 1 2 3; do
  echo "Count: $i"
done`
  },
  bashFindReplace: {
    keywords: ['bash','sed','replace'],
    language: 'bash',
    code: `# replace foo with bar in-place
sed -i 's/foo/bar/g' file.txt`
  },
  bashDownloadCurl: {
    keywords: ['bash','curl','download'],
    language: 'bash',
    code: `curl -O https://example.com/file.zip`
  },

  // ---------------- Tools & Misc (99-100) ----------------
  gitBasic: {
    keywords: ['git','commit','push','init'],
    language: 'bash',
    code: `git init
git add .
git commit -m "Initial"
git push origin main`
  },
  regexEmail: {
    keywords: ['regex','email','pattern'],
    language: 'regex',
    code: `/^[\w.-]+@[\w.-]+\\.[A-Za-z]{2,}$/`
  }
};
