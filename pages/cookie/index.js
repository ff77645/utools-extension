

let allCookies = []
const storageKey = 'COOKIE_MANAGE_URLS'
let urls = []

chrome.storage.sync.get(storageKey,res=>{
  console.log({res});
  urls = res[storageKey] || []
  renderTable()
})

function syncUrls(){
  return chrome.storage.sync.set({
    [storageKey]:urls
  })
}

// 渲染cookie
const cookiesTable = $('#cookie-tbody')
cookiesTable.bind('click',handleUse)

// 渲染网站
const siteTable = $('#site-tbody')
siteTable.bind('click',handleClickSiteTable)


// 获取所有标签页
async function renderTable(){
  const tabs = await chrome.tabs.query({url:urls});
  const cookieGroup = await Promise.all(tabs.map(item=>chrome.cookies.getAll({url:item.url})))
  const _allCookies = cookieGroup.reduce((pre,next)=>{
    return pre.concat(next)
  },[])
  allCookies = _allCookies
  renderCookies(_allCookies)
  renderSite()
}


function renderCookies(cookies){
  const els = cookies.map(item=>{
    return `
      <tr>
        <td>${item.domain}</td>
        <td>${item.name}</td>
        <td>${item.value}</td>
        <td>
          <button class="ck-use" data-domain="${item.domain}" data-name="${item.name}">使用</button>
        </td>
      </tr>
    `
  })
  cookiesTable.html(els.join(''))
}


// 处理点击事件
async function handleUse(e){
  const name = $(e.target).data('name')
  const domain = $(e.target).data('domain')
  if(!name || !domain) return
  const cookie = allCookies.find(i=>i.name === name && i.domain === domain)
  let tabs = await chrome.tabs.query({
    active:true,
  })
  tabs = tabs.filter(i=>!i.url.includes('chrome-extension'))
  const tab = tabs[0]
  if(!tab) return alert('标签获取失败')
  await chrome.cookies.set({
    url:tab.url,
    value:cookie.value,
    path:cookie.path,
    name:cookie.name
  })
}


function renderSite(){
  const els = urls.map((url,index)=>`
    <tr>
      <td>${url}</td>
      <td>
        <button class="button" data-index="${index}" data-action="edit">编辑</button>
        <button class="button" data-index="${index}" data-action="remove">移除</button>
      </td>
    </tr>
  `)
  siteTable.html(els.join(''))
}

async function handleClickSiteTable(e){
  const index = $(e.target).data('index')
  const action = $(e.target).data('action')
  if(index === undefined) return
  console.log({index});
  if(action === 'remove'){
    urls.splice(index,1)
    await syncUrls()
    renderTable()
  }else{
    handleEditSite(index)
  }
}

async function handleEditSite(index){
  const val = urls[index]
  const newVla = prompt('域名编辑',val)
  if(!newVla) return
  try{
    await chrome.tabs.query({url:[newVla]})
  }catch(err){
    alert('域名格式错误.\n 示例:\n\t https://baidu.com/ \n\t *://baidu.com/ \n\t *://*.baidu.com/*')
    return
  }
  urls[index] = newVla
  await syncUrls()
  renderTable()
}

const addSiteBtn = $('#add-site')
const inputBox = $('#input-box')
const inputSite = $('#input-site')
const addSiteConfirmBtn = $('#add-site-confirm')
const addSiteCancleBtn = $('#add-site-cancle')

addSiteBtn.bind('click',function(e){
  addSiteBtn.hide()
  inputBox.show()
  inputSite.focus()
})

addSiteConfirmBtn.bind('click',handleAddSite)
addSiteCancleBtn.bind('click',handleCancle)

function handleCancle(){
  addSiteBtn.show()
  inputBox.hide()
}
async function handleAddSite(){
  const val = inputSite.val()
  if(!val) return
  try{
    await chrome.tabs.query({url:[val]})
  }catch(err){
    alert('域名格式错误.\n 示例:\n\t https://baidu.com/ \n\t *://baidu.com/ \n\t *://*.baidu.com/*')
    return
  }
  urls.push(val)
  addSiteBtn.show()
  inputBox.hide()
  inputSite.val('')
  await syncUrls()
  renderTable()
}
