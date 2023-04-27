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
  let isScrolling = false

  // 메뉴 (서비스, 스토리, 연락처) 클릭시 스크롤 매끄럽게 하기
  nav.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
      if(!isScrolling){
        event.preventDefault() // 주석처리하면 부드러운 스크롤 기능이 동작하지 않음
        history.pushState({}, "", `${this.getAttribute('href')}`);  // URL 주소에 #about, #story, #contact 과 같은 파라미터 추가해서 URL 변경하기

        // console.log(this.getAttribute('href')) // #about, #story, #contact
        // console.log(document.querySelector(this.getAttribute('href'))) // 내가 클릭한 메뉴 링크에 대한 section 엘리먼트 

        // document.querySelector(this.getAttribute('href')).scrollIntoView({ // 화살표 함수가 아니라 function 키워드를 사용해야 this 값이 anchor 엘리먼트를 가리킴
        //     behavior: 'smooth'
        // });

        // document.querySelector(this.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset : 브라우저 상단으로부터 해당 섹션까지의 거리
        
        // 선택한 메뉴에 대한 섹션 위치로 스크롤함 
        // scrollIntoView 은 위치 정확도가 떨어져서 scrollTo 를 사용함
        const offsetToElementFromDocument = document.querySelector(this.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: offsetToElementFromDocument - header.offsetHeight - 50, // 헤더는 position 이 fixed 이므로 실제 섹션은 헤더높이만큼 offset 이 짧아짐. 결국 섹션 상단과 헤더가 50px 만큼 차이를 두고 스크롤이 멈춤.
          behavior: "smooth",
        });
        isScrolling = true 
      }
    });
  });

  let lastScrollLocation = 0 // 최근 스크롤 위치 기억하기
  let sectionToMove, menulink
   

  window.addEventListener('scroll', (event) => {
    if(!isScrolling){ // scrollTo 함수로 스크롤을 적용하면 스크롤 이벤트가 실행되서 다시 scrollTo 함수가 실행되므로 무한루프에 빠진다. 그래서 스크롤이 끝날때까지 아래 코드가 실행되지 않게 함.
      
      // console.log(nav.querySelector('a.active')) // 현재 내가 보고 있는 섹션에 대한 메뉴링크
      // console.log(nav.querySelector('a.active').closest('li').nextElementSibling?.querySelector('a')) // 다음 메뉴링크
      // console.log(nav.querySelector('a.active').closest('li').previousElementSibling?.querySelector('a')) // 이전 메뉴링크

      menulink = nav.querySelector('a.active').closest('li')

      // 스크롤시 이전, 다음 섹션으로 불연속적으로 이동하기
      if (window.pageYOffset > lastScrollLocation) { // 스크롤 내림
        lastScrollLocation = window.pageYOffset
        sectionToMove = menulink.nextElementSibling?.querySelector('a')
      } else {                       
        lastScrollLocation = window.pageYOffset                // 스크롤 올림
        sectionToMove = menulink.previousElementSibling?.querySelector('a')
      }
      // console.log(document.querySelector(sectionToMove?.getAttribute('href'))) // 이동할 이전, 다음 섹션 엘리먼트
      if(sectionToMove?.getAttribute('href') !== undefined){
        // console.log('섹션 이동하기')
        // document.querySelector(sectionToMove.getAttribute('href')).scrollIntoView({ 
        //   behavior: 'smooth'
        // });

        // 브라우저를 벗어난 문서 상단 (window.pageYOffset) 과 브라우저 상단에서 섹션 엘리먼트까지의 거리 (document.querySelector(sectionToMove.getAttribute('href')).getBoundingClientRect().top) 를 더하면 전체문서 상단에서 섹션 엘리먼트까지의 거리가 나옴
        // const offsetToElementFromDocument = document.querySelector(sectionToMove.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset
        // window.scrollTo({
        //   top: offsetToElementFromDocument - header.offsetHeight - 50, // 헤더는 position 이 fixed 이므로 실제 섹션은 헤더높이만큼 offset 이 짧아짐. 결국 섹션 상단과 헤더가 50px 만큼 차이를 두고 스크롤이 멈춤.
        //   behavior: "smooth",
        // });

        // 스크롤 이벤트가 발생하면 이동할 섹션의 a 링크태그를 프로그램적으로 클릭하면 해당 위치로 이동함
        sectionToMove.click() // 이미 설정된 a 태그의 클릭 이벤트에서 처리함
      }
    }

    // 스크롤이 끝났음을 검사하기 (스크롤되는 동안 setTimeout 내부의 콜백함수는 clearTimeout 에 의해 실행되지 않다가 스크롤이 끝나면 더이상 clearTimeout 이 실행되지 않으므로 스크롤이 끝나고 100ms 후에 스크롤이 끝났음을 콜백함수 실행을 알려줌)
    clearTimeout(window.scrollEndTimer)
    window.scrollEndTimer = setTimeout(() => {
      // console.log('scroll ended!')
      isScrolling = false 
    }, 100)

    // if(sectionToMove?.getAttribute('href') !== undefined){
    //   const offsetToElementFromDocument = document.querySelector(sectionToMove.getAttribute('href')).getBoundingClientRect().top + window.pageYOffset
    //   console.log(document.querySelector(sectionToMove.getAttribute('href')).getBoundingClientRect().top, header.offsetHeight + 50)
    //   // 이동하려는 이전, 다음 섹션이 헤더높이로부터 50만큼 떨어진 위치에 근접하면(오차범위 1픽셀) 스크롤이 멈추었다고 판단함
    //   if(Math.abs(document.querySelector(sectionToMove.getAttribute('href')).getBoundingClientRect().top - (header.offsetHeight + 50)) < 0.5){
    //     console.log('scroll ended!')
    //     isScrolling = false  
    //   }
    // }

    sections.forEach(section => {
      // console.log(section.id, section.getBoundingClientRect().top, section.offsetHeight)

      if(section.getBoundingClientRect().top < header.offsetHeight + 100){
        // 현재 스크롤이 위치한 섹션의 메뉴 하이라이트 주기
        nav.querySelector('a.active').classList.remove('active')
        nav.querySelector(`a[href="#${section.id}"]`).classList.add('active')

        // 텍스트 애니메이션 효과 주기
        const title = section.querySelector('.content h3') // 스크롤할때마다 querySelector 를 사용해서 DOM에 접근하면 성능이 저하되므로 특정상황에서만 하기
        const paragraph = section.querySelector('.content p')
        title.classList.add('show')
        paragraph.classList.add('show')

        // setTimeout(() => {
        //   if(sectionToMove?.getAttribute('href') !== undefined && section.id === document.querySelector(sectionToMove.getAttribute('href')).id){ // 이동할 이전, 다음 섹션이 존재하고 이동할 섹션이 section.id 와 일치하는 경우
        //     isScrolling = false 
        //   }
        // }, 800); // 스크롤하는동안 이전, 다음 섹션이 헤더 영역 안으로 들어왔더라도 스크롤이 곧바로 멈추는 것이 아니라서 700ms 초 후에 스크롤이 완전히 멈춘다음에 다시 스크롤이 가능하도록 함
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