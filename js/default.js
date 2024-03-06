

const functions = [
  {name:'Cookie',id:'cookie'},
]


insertDom()

function insertDom(){
  const doms = functions.map(item=>{
    const el = $(`<div class="function"><span>${item.name}</span></div>`)
    el.bind('click',()=>{
      console.log('click',item);
      handleClick(item)
    })
    return el
  })
  $('.app').append(doms)
}


async function handleClick(item){
  // await chrome.action.setPopup({popup:`popups/${item.id}.html`})
  const width = 600
  const windowWidth = window.screen.width
  const left = Math.floor((windowWidth - width) / 2)
  console.log({windowWidth,left});
  window.open(`/pages/${item.id}/index.html`,item.name,`height=600,width=600,top=200,left=${left},toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no`)
}