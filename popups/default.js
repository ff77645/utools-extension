

const dataList = [
  {name:'Cookie 代理',id:'cookie'},
  {name:'操作引导',id:'tour'},
]

renderPage()

function renderPage(){
  const ul = $('<ul></ul>')
  const listHtml = dataList.map(i=>`<li data-id="${i.id}">${i.name}</li>`).join('')
  ul.html(listHtml)
  ul.click(e=>{
    const id = $(e.target).data('id')
    if(!id) return
    const item = dataList.find(i=>i.id===id)
    handleClick(item)
  })
  $('.app').html(ul)
}


async function handleClick(item){
  if(item.id === 'tour') return showTourSidePanel()
  const width = 600
  const screenWidth = window.screen.width
  const left = Math.floor((screenWidth - width) / 2)
  window.open(`/pages/${item.id}/index.html`,item.name,`height=600,width=600,top=200,left=${left},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no`)
}
const TOUR_CONTENT_ID = 'TOUR_CONTENT_ID'
async function showTourSidePanel(){
  const tabs = await chrome.tabs.query({active:true,currentWindow:true})
  const currentTab = tabs[0]
  const url = new URL(currentTab.url)
  const _url = url.origin +'/*'

  console.log({currentTab,_url});
  const tabId = currentTab.id
  // await chrome.sidePanel.setOptions({
  //   tabId,
  //   path: '/pages/toursidepanel/index.html',
  //   enabled: true
  // });
  // await chrome.sidePanel.open({
  //   tabId
  // })
  // await chrome.scripting.registerContentScripts([
  //   {
  //     id:TOUR_CONTENT_ID,
  //     js:['/contentscript/tour.js'],
  //     matches:[_url]
  //   },
  //   {
  //     id:TOUR_CONTENT_ID+'_2',
  //     js:['contentscript/tour.js'],
  //     matches:[_url]
  //   },
  //   // {
  //   //   id:TOUR_CONTENT_ID+'_3',
  //   //   js:['tour.js'],
  //   //   matches:[_url]
  //   // },
  // ])
  await chrome.scripting.executeScript({
    target:{
      tabId
    },
    files:[
      '/js/jquery.min.js',
      '/contentscript/tour.js'
    ]
  })
  await chrome.scripting.insertCSS({
    target:{
      tabId,
    },
    files:['/css/tour.css']
  })
}