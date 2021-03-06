import {RXElement} from "../../rxelement"
import {HTMLSpan} from "../../html/html-span"
import {HTMLA} from "../../html/html-a"
import {BSCloseButton} from "./bs-close-button"
import alertContextualSchema from "../../schemas/components/alert"

export class BSAlert extends RXElement{
  constructor() {
    super()
    this.toolboxInfo.groupId = 'groupComponents'
    this.toolboxInfo.elementId = 'bsAlert'
    this.toolboxInfo.elementName = "Alert"
    this.className = 'BSAlert'

    this.editMarginStyle.padding = '10px'
    //this.editMarginStyle = {}

    this.unshiftGroup({
      id:'alertOptions',
      label:'Alert Options',
    })

    this.meta.tag = 'div'
    this.meta.role = 'alert' 
    this.label = "alert"
    this.acceptedChildren=''
    this.rejectChildren = ['BSCol','BSW100','HTMLThead', 'HTMLTBody', 
                           'HTMLTh', 'HTMLTr', 'HTMLTd']
    this.addClass('alert')
    this.addSchema(alertContextualSchema, 'alertOptions')
  }

  make(){
    return new BSAlert
  }

  metaToModel(model){
    model.attributes.role = this.meta.role
  }

  configSelf(){
    let span1 = new HTMLSpan().setInnerHTML('A simple primary alert with ')
    this.pushChild(span1)

    let link = new HTMLA()
               .setInnerHTML('an example link')
               .addClass('alert-link')
    this.pushChild(link)

    let span2 = new HTMLSpan().setInnerHTML('. Give it a click if you like.')
    this.pushChild(span2)

    this.pushChild(new BSCloseButton)

    this.addClass('alert-primary')
  }

}
