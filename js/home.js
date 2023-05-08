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

  const sections = document.querySelectorAll('.blog-container > div:not(.follow)') // 푸터를 제외한 section 엘리먼트 조회

  window.addEventListener('scroll', (event) => {
    // 스크롤이 끝났음을 검사하기 (스크롤되는 동안 setTimeout 내부의 콜백함수는 clearTimeout 에 의해 실행되지 않다가 스크롤이 끝나면 더이상 clearTimeout 이 실행되지 않으므로 스크롤이 끝나고 100ms 후에 스크롤이 끝났음을 콜백함수 실행을 알려줌)
    scroller.isScrollended()
    .then(result => console.log('scroll ended!'))
    .catch(err => console.log('scrolling...'))

    sections.forEach(section => {
      // console.log(section.id, section.getBoundingClientRect().top, section.offsetHeight)

      if(section.getBoundingClientRect().top < header.offsetHeight + 200){

        // 텍스트 애니메이션 효과 주기 (html 문서에서 about 섹션의 content 에는 right down 클래스를 제외해서 애니메이션 효과 제외함)
        const blogs = section.querySelectorAll('.blog') // 스크롤할때마다 querySelector 를 사용해서 DOM에 접근하면 성능이 저하되므로 특정상황에서만 하기
        blogs.forEach(blog => blog.classList.add('show'))
      }

      // 스크롤이 브라우저 맨 상단에 도달하면 텍스트 애니메이션 초기화하기
      // console.log(scroller.getScrollPosition())
      if(scroller.getScrollPosition() < 10){
        const blogs = section.querySelectorAll('.blog') // 스크롤할때마다 querySelector 를 사용해서 DOM에 접근하면 성능이 저하되므로 특정상황에서만 하기
        blogs.forEach(blog => blog.classList.remove('show'))
      }
    })
  
    if(scroller.getScrollPosition() > header.offsetHeight){
      header.classList.add('active')
      footer.classList.add('hide')
    }else{
      header.classList.remove('active')
      footer.classList.remove('hide')
    }
  })

  // 브라우저 상단으로 스크롤하기
  const arrowUp = document.querySelector('.footer .icons .scroll-up')
  arrowUp.addEventListener('click', (event) => {
    history.pushState({}, "", `#`); // URL 주소 변경 필요함
    scroller.setScrollPosition({top: 0, behavior: 'smooth'})
  })

  const logo = document.querySelector('header .logo')
  logo.addEventListener('click', (event) => {
    event.preventDefault() // 부드러운 스크롤링
    history.pushState({}, "", `#`); // URL 주소 변경 필요함
    scroller.setScrollPosition({top: 0, behavior: 'smooth'}) // 섹션으로 이동하지 않도록 방지하는 역할 (설정하지 않으면 스크롤링되면서 이전 섹션으로 이동함)
  })
})