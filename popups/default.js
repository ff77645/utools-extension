

const dataList = [
  {name:'Cookie 代理',id:'cookie'},
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
  const width = 600
  const screenWidth = window.screen.width
  const left = Math.floor((screenWidth - width) / 2)
  window.open(`/pages/${item.id}/index.html`,item.name,`height=600,width=600,top=200,left=${left},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no`)
}