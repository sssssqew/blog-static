const scroller = new Scroller(false)

window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')
  const footer = document.querySelector('.footer')

  const title = document.querySelector('.post-container .post-title input') // 추가
  const postContents = document.querySelector('.post-container .post-contents') 
  const tagInput = document.querySelector('.post-container .post-tags input') 

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')

    title.classList.toggle('dark') // 추가 
    postContents.classList.toggle('dark')
    tagInput.classList.toggle('dark')
    
    for(const icon of icons){
      icon.classList.contains('active') ? 
        icon.classList.remove('active') 
        : icon.classList.add('active')
    }
  })

  // textarea 자동높이 조절 
  // keydown, keyup 으로 하면 깜빡임 현상 발생
  // postContents.addEventListener('input', function(event){ // this 를 사용하기 위하여 function 키워드로 정의함 
  //   this.style.height = 'auto' // textarea 높이 초기화 
  //   this.style.height = this.scrollHeight + 'px' // 현재 사용자가 입력중인 스크롤높이로 textarea 높이 설정
  // })

  // 태그입력 기능
  const tagList = document.querySelector('.post-container .post-tags ul')
  // const tagInput = document.querySelector('.post-container .post-tags input') 
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

  // a 태그로 하니까 삭제후 브라우저 상단으로 이동해버린다 (수정하기)

  
  // 파일입력 처리하기
  postContents.focus() // 첫로딩때 커서 보여주기
  postContents.insertAdjacentElement('afterbegin', createNewline()) // lastCaretLine 을 새로운 줄로 초기화하지 않으면 addFileToCurrentLine 함수를 실행하면 파일이 편집기 외부에 추가된다
  let lastCaretLine = postContents.firstChild 
  const uploadInput = document.querySelector('.upload input')
  uploadInput.addEventListener('change', function(event){
    const files = this.files

    if(files.length > 0){
      for(const file of files){
        const fileType = file.type 

        if(fileType.includes('image')){
          console.log('image')
          const img = document.createElement('img')   
          img.src = URL.createObjectURL(file) // 업로드한 파일의 임시경로 (이미지 경로)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, img) // 에디터에 파일추가
        }else if(fileType.includes('video')){
          console.log('video')
          const video = document.createElement('video')
          video.className = 'video-file'
          video.controls = true
          video.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, video)
        }else if(fileType.includes('audio')){
          console.log('audio')
          const audio = document.createElement('audio')
          audio.className = 'audio-file'
          audio.controls = true
          audio.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, audio)
        }else{
          console.log('file')
          const div = document.createElement('div')
          div.className = 'normal-file'
          div.contentEditable = false 
          div.innerHTML = `
            <div class='file-icon'>
              <span class="material-icons">folder</span>
            </div>
            <div class='file-info'>
              <h3>${getFileName(file.name, 70)}</h3>
              <p>${getFileSize(file.size)}</p>
            </div>
          `
          lastCaretLine = addFileToCurrentLine(lastCaretLine, div) // 에디터에 파일추가 및 파일이 추가될때마다 커서위치 업데이트하기
        }
      }
      
      // 커서위치를 맨 마지막으로 추가된 파일 아래쪽에 위치시키기
      const selection = document.getSelection()
      selection.removeAllRanges()

      console.log(lastCaretLine)
      const range = document.createRange()
      range.selectNodeContents(lastCaretLine)
      range.collapse()
      selection.addRange(range) 

      postContents.focus() // 파일을 모두 업로드한 후 커서 보여주기
    }
  })

  postContents.addEventListener('blur', function(event){ 
    lastCaretLine = document.getSelection().anchorNode // blur일때 마지막 커서 위치의 엘리먼트 저장하기
    console.log(lastCaretLine.parentNode, lastCaretLine, lastCaretLine.length)
  })

  function createNewline(){
    const newline = document.createElement('div')
    newline.innerHTML = `<br/>`
    return newline
  }
  // blur 일때 마지막 커서 위치 바로 아래쪽에 새로운 줄을 생성하고 파일을 추가함
  // 파일 추가후 다시 아래쪽에 새로운 줄 생성함
  function addFileToCurrentLine(line, file){
    if(line.nodeType === 3) line = line.parentNode // 커서 위치에 글자가 있는 경우 line 은 텍스트노드기 때문에 insertAdjacentElement 적용하지 못함 (부모는 div 엘리먼트라 적용가능)
    line.insertAdjacentElement("afterend", createNewline())   // 추가
    line.nextSibling.insertAdjacentElement("afterbegin", file)  
    line.nextSibling.insertAdjacentElement("afterend", createNewline())

    return line.nextSibling.nextSibling // 추가된 파일 아래쪽에 새로 생성된 줄 
  }

  function getFileName(name, limit){
    return name.length > limit ? `${name.slice(0, limit)}... ${name.slice(name.lastIndexOf('.'), name.length)}` : name
  }
  function getFileSize(number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number >= 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number >= 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
  }
})


