import {OptionFragment} from "../option-fragment"

class Attributes extends OptionFragment{
  constructor(){
    super()
    this.schema = {
      label:'Attributes',
      widget:'OpNameValueInput',
      group:'generalOptions',
      defaultValue:{},
    }

    //this.metaFragment = '' 

    this.fieldName = 'attributes'
  }

  copyMeta(from, to){
    to[this.fieldName] = from[this.fieldName]
  }

  metaToModel(model, meta){
    let metaFragment = meta[this.fieldName]
    model.attributes['aria-label'] = metaFragment
  }
}

var addonAttributes = (node, groupName)=>{
  let attributes = new Attributes
  attributes.addon(node, groupName)
  return attributes
}

export {addonAttributes}
