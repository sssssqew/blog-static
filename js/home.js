const scroller = new Scroller(false)

window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')
  const footer = document.querySelector('.footer')

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')
    
    for(const icon of icons){
      icon.classList.contains('active') ? 
        icon.classList.remove('active') 
        : icon.classList.add('active')
    }
  })

  window.addEventListener('scroll', (event) => {
    // 스크롤이 끝났음을 검사하기 (스크롤되는 동안 setTimeout 내부의 콜백함수는 clearTimeout 에 의해 실행되지 않다가 스크롤이 끝나면 더이상 clearTimeout 이 실행되지 않으므로 스크롤이 끝나고 100ms 후에 스크롤이 끝났음을 콜백함수 실행을 알려줌)
    scroller.isScrollended()
    .then(result => console.log('scroll ended!'))
    .catch(err => console.log('scrolling...'))
  
    if(scroller.getScrollPosition() > header.offsetHeight){
      header.classList.add('active')
      footer.classList.add('hide')
    }else{
      header.classList.remove('active')
      footer.classList.remove('hide')
    }
  })
})