

var selectedImg = []

init()

function init(){
  renderToolbar()
  document.body.addEventListener('click', handleClick,true)

}

var whiteClassList = ['utool-s-img','utool-imgbox','utools-btn']

function handleClick(e){
  const target = e.target
  console.log({target})
  if(whiteClassList.includes(target.className)) return
  e.stopPropagation()
  const img = getImage(target)
  if(!img) return
  const url = img.src
  console.log({img,url})
  selectedImg.push(url)
  renderToolbar()
}

function getImage(el){
  if(el.nodeName === 'IMG') return el
  const img = el.querySelector('img')
  if(img && img.nodeName === 'IMG') return img
  const parent = el.parentElement 
  if(!parent || parent === document.body) return undefined
  return getImage(parent)
}

function hideSelectedImg(){
  const el = document.querySelector('.utool-imgbox')
  if(el) el.remove()
}
function showSelectedImg(e){
  e.stopPropagation()
  const el = document.querySelector('.utool-imgbox')
  console.log({el});
  if(el) return el.remove()
  const imageBox = document.createElement('div')
  imageBox.className = 'utool-imgbox'

  const imgStyle = `
    width:200px;
    height:200px;
    border-radius: 3px;
    object-fit: cover;
    object-position: center;
  `
  selectedImg.forEach(url => {
    const img = document.createElement('img')
    img.classList.add('utool-s-img')
    img.src = url
    img.style = imgStyle
    imageBox.appendChild(img)
  })

  imageBox.style = `
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    height: 100vh;
    background-color: rgba(0,0,0,0.8);
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    align-content: start;
    overflow-y: auto;
  `
  document.body.appendChild(imageBox)
}

function renderToolbar(){
  const toolbar = 'utool-saveimagebar'
  const old_wrap = document.querySelector(`#${toolbar}`)
  if(old_wrap) old_wrap.remove()
  const wrap = document.createElement('div')
  wrap.id = toolbar
  const confirmBtn = document.createElement('div')
  const cancelBtn = document.createElement('div')
  const selected = document.createElement('div')
  confirmBtn.className = cancelBtn.className = selected.className = 'utools-btn'
  selected.innerHTML = `已选择：${selectedImg.length}`

  selected.style = `margin-left: 10px;color:#eee;cursor: pointer;`

  selected.addEventListener('click',showSelectedImg)
  wrap.style = `
    position: fixed;
    top: 0;
    right: 0;
    padding: 10px 15px;
    background-color: rgba(0,0,0,0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 0 5px 5px;
  `

  const btnStyle = `
    padding: 5px 10px;
    background-color: #fff;
    color: #000;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
  `

  confirmBtn.style = btnStyle + 'margin-right:10px;'
  cancelBtn.style = btnStyle
  confirmBtn.innerText = '确认'
  cancelBtn.innerText = '取消'
  cancelBtn.addEventListener('click', function(){
    document.body.removeEventListener('click', handleClick)
    hideSelectedImg()
    wrap.remove()
  })
  wrap.appendChild(confirmBtn)
  wrap.appendChild(cancelBtn)
  if(selectedImg.length){
    wrap.appendChild(selected)
  }
  document.body.appendChild(wrap)
}

