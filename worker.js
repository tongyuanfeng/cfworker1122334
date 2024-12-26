const ipRequests = {};
addEventListener('fetch', event => {
  const request = event.request

  // const ip = request.headers.get('CF-Connecting-IP'); // 获取请求的IP地址

  // // 检查IP地址是否存在于ipRequests对象中，并且最近请求时间在3秒内
  // if (ip in ipRequests && Date.now() - ipRequests[ip] < 1) {
  //   // 如果请求太频繁，返回一个429状态码（太多请求）
  //   return new Response('Too Many Requests', { status: 429 });
  // }

  // // 更新IP地址的最近请求时间戳
  // ipRequests[ip] = Date.now();


  const url = new URL(request.url)
  const path = url.pathname;
  const isImgPath = path.startsWith('/img/');

  if (isImgPath) {
      const proxyUrl = 'https://m.media-amazon.com/images' + path.substr(4); // Modify the request URL to match the desired format

      console.log(proxyUrl)
      // make subrequests with the global fetch() function
      let res =   fetch(proxyUrl, request);
      console.log(res)
      return event.respondWith(res);

  }

  const isImgPath2 = path.startsWith('/images/');

  if (isImgPath2) {
      const proxyUrl = 'https://imgfile.shop' + path; // Modify the request URL to match the desired format

      console.log(proxyUrl)
      // make subrequests with the global fetch() function
      let res =   fetch(proxyUrl, request);
      console.log(res)
      return event.respondWith(res);

  }



  event.respondWith(handleRequest(event.request))
})


function decodeBase64(base64) {
return decodeURIComponent(escape(atob(base64)));
}

async function handleRequest(request) {
  const url = new URL(request.url)

  const ask_domain=request.headers.get('host')
  console.log(request.headers.get('host'))

  const path = url.pathname;
  if (path.includes('/wp-includes/') || path.includes('/wp-content/') || path.includes('/wp-admin/')|| path.includes('/test/')) {
      return new Response('Forbidden', { status: 404 });
  }  


  url.host = decodeBase64('c2Vvc2l0ZXNweS5zaG9w')
  url.protocol='http'
  const headers = new Headers(request.headers)

  const modifiedRequest = new Request(url, {
  method: request.method,
  headers: headers,
  body: request.body,
  redirect: 'manual'
  })

  const response = await fetch(modifiedRequest)

  const modifiedHeaders = new Headers(response.headers)
  modifiedHeaders.set('Access-Control-Allow-Origin', '*')

  const modifiedResponse = new Response(response.body, {
  status: response.status,
  statusText: response.statusText,
  headers: modifiedHeaders
  })
  return modifiedResponse
  }

