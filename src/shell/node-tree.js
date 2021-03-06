import {RXComponent} from "../basic/rxcomponent"


class TreeNode extends RXComponent{
  constructor(tree, schema){
    super()
    this.tree = tree
    this.schema = schema ? schema : {id:''}
    this.cssClass('tree-node')

    this.nodeBody = new RXComponent()
                    .cssClass('tree-node-body')

    let titleIcon = new RXComponent()
                    .cssClass('title-icon')
                    .domOn('click', ()=>{
                      this.tongle('open')
                    })
                    //.setInnerHTML('△')
    this.titleText = new RXComponent()
                    .cssClass('title-text')
                    .domOn('click',()=>{
                      if(this.schema.id){
                        this.tree.onNodeClick(this.schema)
                      }
                    })
                    
    this.nodeTitle = new RXComponent()
                    .cssClass('tree-node-title')
                    .pushChild(titleIcon)
                    .pushChild(this.titleText)
                    

    this.pushChild(this.nodeTitle)
    this.pushChild(this.nodeBody)

    if(schema){
      let title = schema.tag
      if(schema.label !== schema.tag){
        title = this.makeTitle(schema)
      }
      this.setTitle(title)
      this.cssClass('leaf')
      if(schema.state === 'focusedState'){
        this.cssClass('focused')
      }
      if(schema.children.length > 0){
        this.removeCssClass('leaf')
        this.loadChildren(schema.children)
      }
    }

  }

  makeTitle(schema){
    return schema.tag + "(" + schema.label + ")" + ':' +schema.id
  }

  setTitle(title){
    this.titleText.setInnerHTML(title)
    return this
  }

  add(node){
    node.parent = this
    this.nodeBody.pushChild(node)
    return this
  }

  removeChild(node){
    this.nodeBody.removeChild(node)
    if(this.nodeBody.children.length === 0){
      this.cssClass('leaf')
    }
  }

  loadChildren(schemas){
    if(!schemas) return

    schemas.forEach((schema)=>{
      this.add(new TreeNode(this.tree, schema))
    })
    if(this.nodeBody.$dom){
      this.nodeBody.refresh()
    }
  }

  focuseNode(node){
    if(this.schema.id && node.id == this.schema.id){
      this.cssClass('focused')
    }
    else{
      this.removeCssClass('focused')
    }

    this.nodeBody.children.forEach((child)=>{
      child.focuseNode(node)
    })
  }

  unFocusNode(id){
    if(this.schema && this.schema.id === id){
      this.removeCssClass('focused')
    }
    this.nodeBody.children.forEach((child)=>{
      child.unFocusNode(id)
    })
  }

  excuteCommand(commandSchema){
    if(commandSchema.command === 'new'
      && this.schema.id == commandSchema.parentId){
      let newNode = new TreeNode(this.tree, commandSchema.node)
      this.insertBefore(newNode, commandSchema.nextSblilingId)
      return true
    }
    if(this.schema.id && commandSchema.nodeId === this.schema.id){
      if(commandSchema.command === 'delete'){
        this.parent.removeChild(this)
      }
      if(commandSchema.command === 'move'){
        let oldParent = this.tree.getNodeById(commandSchema.oldParentId)
        oldParent = oldParent ? oldParent : this.tree.bodyNode
        oldParent.removeChild(this)
        let parent = this.tree.getNodeById(commandSchema.parentId)
        parent = parent ? parent : this.tree.bodyNode
        parent.insertBefore(this, commandSchema.nextSblilingId)
      }
      if(commandSchema.command === 'change'){
        this.schema.tag = commandSchema.meta.tag
        this.setTitle(this.makeTitle(this.schema))
      }     
      return true
    }
    for(var i in this.nodeBody.children){
      if(this.nodeBody.children[i].excuteCommand(commandSchema)){
        return true
      }
    }
  }

  insertBefore(node, sbilingId){
    node.parent = this
    let sbilingNode = this.tree.getNodeById(sbilingId)
    this.nodeBody.children.inertBefore(node, sbilingNode)
    //console.log(this.nodeBody.children)
    this.removeCssClass('leaf')
    this.nodeBody.refresh()
  }

  getNodeById(id){
    if(this.schema.id && this.schema.id === id){
      return this
    }
    for(var i in this.nodeBody.children){
      let node = this.nodeBody.children[i].getNodeById(id)
      if(node){
        return node
      }
    }
  }

  clearChild(){
    this.nodeBody.clearChild()
    this.cssClass('leaf')
  }

}


export class NodeTree extends RXComponent{
  constructor(){
    super()
    this.cssClass('bottom-view')
    this.pushChild(
      new RXComponent()
      .cssClass('view-header')
      .setInnerHTML('Elements View')
    )

    this.bodyNode = new TreeNode(this)
                     .setTitle('body')
                     .cssClass('disable')

    let rootNode = new TreeNode(this)
                   .setTitle('html')
                   .cssClass('disable')
                   .add(this.bodyNode )
    this.pushChild(
      new RXComponent()
      .cssClass('view-body')
      .pushChild(
        new RXComponent()
        .cssClass('view-content')
        .pushChild(rootNode)
      )
    )

    this.assembleTreeView = (nodes)=>{
      this.bodyNode.loadChildren(nodes)
    }

    this.onNodeClick = (node)=>{}
  }

  focusNode(node){
    this.bodyNode.focuseNode(node)
  }

  unFocusNode(id){
    this.bodyNode.unFocusNode(id)
  }

  excuteCommand(commandSchema){
    if(commandSchema.command == 'clear'){
      this.bodyNode.clearChild()
      this.bodyNode.refresh()
      return
    }
    this.bodyNode.excuteCommand(commandSchema)
  }

  getNodeById(id){
    return this.bodyNode.getNodeById(id)
  }
}
