class Scroller{
  #isScrolling
  #scrollEndTimer

  constructor(isScrolling){
    this.#isScrolling = isScrolling
    this.#scrollEndTimer = null 
  }
  getScrollPosition(){
    return window.pageYOffset
  }
  setScrollPosition(position){
    window.scrollTo(position);
    this.#setScrollState(true)
  }
  getScrollState(){
    return this.#isScrolling
  }
  #setScrollState(state){
    this.#isScrolling = state 
  }
  isScrollended(){
    return new Promise((resolve, reject) => {
      clearTimeout(this.#scrollEndTimer)
      // reject() // 스크롤이 끝났다는 결과를 알기 위해서 해당 코드는 주석처리함
      this.#scrollEndTimer = setTimeout(() => {
        this.#setScrollState(false)
        resolve()
      }, 100)
    })
  }
}