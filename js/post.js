const postContents = document.querySelector('.post-container .post-contents textarea')

// keydown, keyup 으로 하면 깜빡임 현상 발생
postContents.addEventListener('input', function(event){ // this 를 사용하기 위하여 function 키워드로 정의함 
  this.style.height = 'auto' // textarea 높이 초기화 
  this.style.height = this.scrollHeight + 'px' // 현재 사용자가 입력중인 스크롤높이로 textarea 높이 설정
})