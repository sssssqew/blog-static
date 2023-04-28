/* Firefox 에서 섹션 넘어가는게 좀 어색하긴 한데 이건 스크롤링 끝나는 시점 (100ms를 조절하면 될것 같다) */
const scroller = new Scroller(false)

window.addEventListener("load", (event) => {
  window.scrollTo(0, 1);

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
  nav.querySelectorAll('li a').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
      if(!scroller.getScrollState()){ // 스크롤링이 멈춘 경우
        event.preventDefault() // 주석처리하면 부드러운 스크롤 기능이 동작하지 않음
        history.pushState({}, "", `${this.getAttribute('href')}`);  // URL 주소에 #about, #story, #contact 과 같은 파라미터 추가해서 URL 변경하기

        // console.log(this.getAttribute('href')) // #about, #story, #contact
        // console.log(document.querySelector(this.getAttribute('href'))) // 내가 클릭한 메뉴 링크에 대한 section 엘리먼트 

        // document.querySelector(this.getAttribute('href')).getBoundingClientRect().top + scroller.getScrollPosition() : 브라우저 상단으로부터 해당 섹션까지의 거리
        
        // 선택한 메뉴에 대한 섹션 위치로 스크롤함 
        // scrollIntoView 은 위치 정확도가 떨어져서 scrollTo 를 사용함
        // 브라우저를 벗어난 문서 상단 (scroller.getScrollPosition()) 과 브라우저 상단에서 섹션 엘리먼트까지의 거리 (document.querySelector(sectionToMove.getAttribute('href')).getBoundingClientRect().top) 를 더하면 전체문서 상단에서 섹션 엘리먼트까지의 거리가 나옴
        const offsetToElementFromDocument = document.querySelector(this.getAttribute('href')).getBoundingClientRect().top + scroller.getScrollPosition()
        scroller.setScrollPosition({
          top: offsetToElementFromDocument - header.offsetHeight - 10, // 헤더는 position 이 fixed 이므로 실제 섹션은 헤더높이만큼 offset 이 짧아짐. 결국 섹션 상단과 헤더가 10px 정도 간격을 두고 만나면 스크롤이 멈춤.
          behavior: "smooth",
        })
      }
    });
  });

  let lastScrollLocation = 0 // 최근 스크롤 위치 기억하기
  let sectionToMove, menulink
   

  window.addEventListener('scroll', (event) => {
    if(!scroller.getScrollState()){ // scrollTo 함수로 스크롤을 적용하면 스크롤 이벤트가 실행되서 다시 scrollTo 함수가 실행되므로 무한루프에 빠진다. 그래서 스크롤이 끝날때까지 아래 코드가 실행되지 않게 함.
      
      menulink = nav.querySelector('a.active').closest('li') // 현재 내가 보고 있는 섹션에 대한 메뉴링크

      // 스크롤시 이전, 다음 섹션으로 불연속적으로 이동하기
      if (scroller.getScrollPosition() > lastScrollLocation) { // 스크롤 내림
        lastScrollLocation = scroller.getScrollPosition()
        sectionToMove = menulink.nextElementSibling?.querySelector('a') // 다음 메뉴링크
      } else {                       
        lastScrollLocation = scroller.getScrollPosition()                // 스크롤 올림
        sectionToMove = menulink.previousElementSibling?.querySelector('a') // 이전 메뉴링크
      }

      // 스크롤 이벤트가 발생할때 이동할 섹션의 a 링크태그를 자동으로(프로그램적으로) 클릭해서 해당 섹션으로 이동함 (중요한 로직)

      // 스크롤이 될때 해당섹션으로 이동하면 되는데 해당섹션으로 이동하는건 해당섹션에 대한 메뉴링크(a 태그)를 클릭해주면 된다. (이미 있는 코드)
      // console.log(document.querySelector(sectionToMove?.getAttribute('href'))) // 이동할 이전, 다음 섹션 엘리먼트
      if(sectionToMove?.getAttribute('href') !== undefined){ // 이동할 섹션이 있는 경우
        sectionToMove.click() // 이미 설정된 a 태그의 클릭 이벤트에서 처리함
      }
    }

    // 스크롤이 끝났음을 검사하기 (스크롤되는 동안 setTimeout 내부의 콜백함수는 clearTimeout 에 의해 실행되지 않다가 스크롤이 끝나면 더이상 clearTimeout 이 실행되지 않으므로 스크롤이 끝나고 100ms 후에 스크롤이 끝났음을 콜백함수 실행을 알려줌)
    scroller.isScrollended()
    .then(result => console.log('scroll ended!'))
    .catch(err => console.log('scrolling...'))

    sections.forEach(section => {
      // console.log(section.id, section.getBoundingClientRect().top, section.offsetHeight)

      if(section.getBoundingClientRect().top < header.offsetHeight + 50){
        // 현재 스크롤이 위치한 섹션의 메뉴 하이라이트 주기
        nav.querySelector('a.active').classList.remove('active')
        nav.querySelector(`a[href="#${section.id}"]`).classList.add('active')

        // 텍스트 애니메이션 효과 주기 (html 문서에서 about 섹션의 content 에는 right down 클래스를 제외해서 애니메이션 효과 제외함)
        const title = section.querySelector('.content h3') // 스크롤할때마다 querySelector 를 사용해서 DOM에 접근하면 성능이 저하되므로 특정상황에서만 하기
        const paragraph = section.querySelector('.content p')
        title.classList.add('show')
        paragraph.classList.add('show')
      }

      // 스크롤이 브라우저 맨 상단에 도달하면 텍스트 애니메이션 초기화하기
      // console.log(scroller.getScrollPosition())
      if(scroller.getScrollPosition() < 10){
        const title = section.querySelector('.content h3') // 스크롤할때마다 querySelector 를 사용해서 DOM에 접근하면 성능이 저하되므로 특정상황에서만 하기
        const paragraph = section.querySelector('.content p')
        title.classList.remove('show')
        paragraph.classList.remove('show')
      }
    })

    // 스크롤이 어느정도 아래로 내려오면 헤더에 그림자 주기
    // console.log(scroller.getScrollPosition(), header.offsetHeight)

    scroller.getScrollPosition() > header.offsetHeight ? 
      header.classList.add('active') 
      : header.classList.remove('active')
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
});