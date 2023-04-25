window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')
    
    for(const icon of icons){
      icon.classList.contains('active') ? 
        icon.classList.remove('active') 
        : icon.classList.add('active')
    }
  })

  // 현재 스크롤이 위치한 섹션의 메뉴 하이라이트 주기
  const sections = document.querySelectorAll('section:not(.footer)')
  const nav = document.querySelector('.navbar ul')

  window.addEventListener('scroll', (event) => {
    sections.forEach(section => {
      // console.log(section.id, section.getBoundingClientRect().top, section.offsetHeight)

      if(section.getBoundingClientRect().top < header.offsetHeight){
        nav.querySelector('a.active').classList.remove('active')
        nav.querySelector(`a[href="#${section.id}"]`).classList.add('active')
      }
    })

    // 스크롤이 어느정도 아래로 내려오면 헤더에 그림자 주기
    // console.log(window.pageYOffset, header.offsetHeight)

    window.pageYOffset > header.offsetHeight ? 
      header.classList.add('active') 
      : header.classList.remove('active')
  })

  // 브라우저 상단으로 스크롤하기
  const arrowUp = document.querySelector('.footer .icons .scroll-up')
  arrowUp.addEventListener('click', (event) => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  })

});