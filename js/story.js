const scroller = new Scroller(false)

window.addEventListener("load", (event) => {
  // 테마변경 (다크모드/ 일반모드)
  const mode = document.querySelector('.mode')
  const icons = mode.querySelectorAll('.fa-solid')
  const header = document.querySelector('header')
  const categoryContainer =  document.querySelector('.category-container')
  const footer = document.querySelector('.footer')

  mode.addEventListener('click', (event) => {
    document.body.classList.toggle('dark')
    header.classList.toggle('dark')
    categoryContainer.classList.toggle('dark')
    
    for(const icon of icons){
      icon.classList.contains('active') ? 
        icon.classList.remove('active') 
        : icon.classList.add('active')
    }
  })

  const blogContainer = document.querySelector('.blog-container')
  blogContainer.innerHTML += getBlogList(10) // 초기에 10개 추가하기
  

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

    // 무한스크롤 구현 
    // 브라우저창 높이 : document.documentElement.clientHeight
    // 문서 상단 높이 : window.pageYOffset
    const scrollHeight = Math.max( // 전체문서 높이 (스크롤이벤트 내부에 있어야 함)
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
    );
    if(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight) < 50){ // 스크롤을 브라우저창 아래까지 다 내린경우
      console.log('scroll is bottom of browser!')
      blogContainer.innerHTML += getBlogList(10) // 블로그글 10개씩 추가하기
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

// 더미 데이터 생성
function getBlogList(num){
  let blogList = ''
  for (let i = 0; i < num; i++) {
    blogList += `
        <div class="blog">
        <div class="left">
          <ul>
            <li class="category-name"><a href="#">여행</a></li>
            <li class="posting-time">1시간전</li>
            <li><a href="#" class="likes">공감</a><span>9</span></li>
          </ul>
        </div>
        <div class="middle">
          <ul>
            <li><h3>제주도 오른 까페 방문하기</h3></li>
            <li><p>성산의 해안도로를 따라 달리다 보면 보이는 오른 카페는 제주도의 자연요소 중 하나인 오름을 모티브로 한 카페의 콘셉트인 만큼 자연과 함께 커피를 마시며 즐길 수 있었던 것 같아요.😋</p></li>
            <li>
            <ul>
              <li>
                <div class="account">
                  <img src="../imgs/avatar.jpg" alt="">
                  촌부 <span>by 농돌이</span>
                </div>
              </li>
              <li><button>구독하기</button></li>
            </ul>
            </li>
          </ul>
        </div>
        <div class="right">
          <ul>
            <li>
            <img src="../imgs/waterfall.jpg" alt="blog-thumbnail">
            </li>
          </ul>
        </div>
      </div>
    `
  }
  return blogList
}