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

  const sections = document.querySelectorAll('section:not(.footer)') // 푸터를 제외한 section 엘리먼트 조회
  const nav = document.querySelector('.navbar ul')

  // 메뉴 (서비스, 스토리, 연락처) 클릭시 스크롤 매끄럽게 하기
  nav.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        event.preventDefault();

        // console.log(this.getAttribute('href')) // #about, #story, #contact
        // console.log(document.querySelector(this.getAttribute('href'))) // 내가 클릭한 메뉴 링크에 대한 section 엘리먼트 

        document.querySelector(this.getAttribute('href')).scrollIntoView({ // 화살표 함수가 아니라 function 키워드를 사용해야 this 값이 anchor 엘리먼트를 가리킴
            behavior: 'smooth'
        });
    });
  });

  window.addEventListener('scroll', (event) => {
    sections.forEach(section => {
      // console.log(section.id, section.getBoundingClientRect().top, section.offsetHeight)

      if(section.getBoundingClientRect().top < header.offsetHeight){
        // 현재 스크롤이 위치한 섹션의 메뉴 하이라이트 주기
        nav.querySelector('a.active').classList.remove('active')
        nav.querySelector(`a[href="#${section.id}"]`).classList.add('active')

        // 텍스트 애니메이션 효과 주기
        const title = section.querySelector('.content h3') // 스크롤할때마다 querySelector 를 사용해서 DOM에 접근하면 성능이 저하되므로 특정상황에서만 하기
        const paragraph = section.querySelector('.content p')
        title.classList.add('show')
        paragraph.classList.add('show')
      }

      // 스크롤이 브라우저 맨 상단에 도달하면 텍스트 애니메이션 초기화하기
      // console.log(window.pageYOffset)
      if(window.pageYOffset < 10){
        const title = section.querySelector('.content h3') // 스크롤할때마다 querySelector 를 사용해서 DOM에 접근하면 성능이 저하되므로 특정상황에서만 하기
        const paragraph = section.querySelector('.content p')
        title.classList.remove('show')
        paragraph.classList.remove('show')
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