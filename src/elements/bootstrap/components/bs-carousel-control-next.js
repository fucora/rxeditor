import {HTMLA} from "../../html/html-a"
import {HTMLSpan} from "../../html/html-span"

//import {BSTextarea} from "./bs-textarea"

export class BSCarouselControlNext extends HTMLA{
  constructor(carousel) {
    super()
    this.toolboxInfo.groupId = 'groupComponents'
    this.toolboxInfo.elementId = 'bsCarouselControlNext'
    this.toolboxInfo.elementName = "Carousel Control Next"
    this.className = 'BSCarouselControlNext'

    this.acceptedChildren= []

    this.label = "next"
    this.addClass('carousel-control-next')
    this.setEditPadding('')
    this.onclick = (event)=>{
      //event.stopPropagation()
      this.carousel.activeNext()
    }
  }

  make(){
    return new BSCarouselControlNext
  }

  setCarousel(carousel){
    this.carousel = carousel
    return this
  }

  configSelf(){
    this.setAttribute('href', "#" + this.carousel.getCarouselId())
    this.setAttribute('role', "button")
    this.setAttribute('data-slide', "next")
    this.setInnerHTML(`<span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>`)
  }

}
