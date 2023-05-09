// textarea 자동높이 조절 
const postContents = document.querySelector('.post-container .post-contents textarea')

// keydown, keyup 으로 하면 깜빡임 현상 발생
postContents.addEventListener('input', function(event){ // this 를 사용하기 위하여 function 키워드로 정의함 
  this.style.height = 'auto' // textarea 높이 초기화 
  this.style.height = this.scrollHeight + 'px' // 현재 사용자가 입력중인 스크롤높이로 textarea 높이 설정
})

// 태그입력 기능
const tagList = document.querySelector('.post-container .post-tags ul')
const tagInput = document.querySelector('.post-container .post-tags input') 
const tagslimit = 10 // 태그 갯수 제한
const tagLength = 10 // 태그 글자수 제한

tagInput.addEventListener('keyup', function(event){
  console.log('태그 입력중...', event.key)
  if(event.key === 'Enter' && this.value.trim() !== '' && this.value.trim().length <= tagLength && tagList.children.length < tagslimit){
    const tag = document.createElement('li')
    tag.innerHTML = `#${this.value.trim()}<a href='#'>x</a>`
    tagList.appendChild(tag)
    this.value = ''
  }
})

// 태그 삭제 (이벤트 위임 사용)
tagList.addEventListener('click', function(event){
  console.log(event.target, event.target.parentElement, event.target.hasAttribute('href'))
  if(event.target.hasAttribute('href')){ // x 표시를 클릭시(a 태그인지 확인)
    tagList.removeChild(event.target.parentElement) // 리스트에서 x 표시한 태그(li) 삭제
  }
})