


// 渲染工具栏
function renderToolbar() {
  // const head = document.querySelector('head')
  // const meta = document.createElement('meta')
  // meta.setAttribute('http-equiv', 'Content-Security-Policy')
  // meta.setAttribute('content', 'default-src \'self\'; img-src https://*; frame-src https://*; frame-ancestors https://*;')
  // head.append(meta)
  const iframeUrl = chrome.runtime.getURL('/popups/default.html');
  console.log({iframeUrl});
  const ifram = $(`<iframe src="${iframeUrl}" width="300px" height="300px"></iframe>`)
  $('body').append(ifram)
}


renderToolbar()