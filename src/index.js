import React , {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class CloseBtn extends React.Component {
  constructor(props){
    super(props);
    this.distroyParent = this.distroyParent.bind(this);
  }
  distroyParent(){//XXX: How to access the parent node(Now I use passing function for 4 layers. Q)
    this.props.distroyMe();
  }
  render(){
    return (
      <span className="close item" onClick={this.distroyParent}>×</span>
    );
  }
}
class ListItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {itemIdx: this.props.idx, opened:true, done: false};
    this.checkDone = this.checkDone.bind(this);
    this.distroyMe = this.distroyMe.bind(this);
  }
  distroyMe(){
    
    if(this.state.opened){
      if(this.state.done){
        this.props.decreaseDoneNum();
      }else{
        this.props.decreaseTodoNum();
      }
      this.setState(prevState => ({opened: !prevState.opened}));
    }else{
      console.log("distroy ERR!");
    }
    
  }
  checkDone(e){
    console.log(e.target.classList);
    if(!e.target.classList.contains('close')){
      //TODO toggle num
      e.target.classList.toggle('done');
      if(e.target.classList.contains('done')){
        console.log("YES done");
        this.props.decreaseTodoNum();
        this.props.increaseDoneNum();
      }else{
        this.props.increaseTodoNum();
        this.props.decreaseDoneNum();
      }
      this.setState(prevState=>({done: !prevState.done}));//XXX: ???
    }
  }

  render(){
    var disp = "";
    if(!this.state.opened){
      disp="none";
    }
    var style = {
      display: disp
    };
    return (

        <li onClick={e=>this.checkDone(e)} style={style}>{this.props.text}<CloseBtn distroyMe={this.distroyMe}/></li>
    );
  }
}
class ListTitle extends React.Component {
  constructor(props){
    super(props);
    this.state = {inputValue: "", itemCount:0};
    this.handleAddItem = this.handleAddItem.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
    this.decreTodoNum = this.decreTodoNum.bind(this);
    this.increTodoNum = this.increTodoNum.bind(this);
  }
  increTodoNum(){
    this.props.inTodoNum();
  }
  decreTodoNum(){
    console.log(">>>DEDEDE");
    this.props.deTodoNum();
  }
  updateInputValue(evt){
      this.setState({
        inputValue: evt.target.value
      });
  }
  handleAddItem(){
    if(this.state.inputValue){
      this.props.addItem(<ListItem text={this.state.inputValue} decreaseTodoNum={this.decreTodoNum} increaseTodoNum={this.increTodoNum} idx={this.state.itemCount} increaseDoneNum={this.props.inDoneNum} decreaseDoneNum={this.props.deDoneNum}/>);
      this.setState(prevState=> ({itemCount:prevState.itemCount + 1, inputValue: ""}));
    }else{
      alert("YOU must WRITE SOMETHING!!!");
    }
    
  }
  render(){//XXX: why can't i use ()=>{dist...} in closeBtn}
    return (
      <div className="TODOListHeader" >
        <div className="listStaticBlock">
          <p className="unfinishedItemsNum">Unfinished items: {this.props.todoNum}</p>
          <CloseBtn distroyMe={this.props.distroyList}/>
        </div>
        <h2 id={this.props.title} className="listTitle" contentEditable="true">{this.props.title}</h2>
        <input type="text" id="TODOInput" onChange={evt=>this.updateInputValue(evt)} placeholder="Type the TODO items here..." value={this.state.inputValue}/>
        <span className="addBtn" onClick={this.handleAddItem}>Add</span>
      </div>
    );
  }
}
class TodoList extends React.Component {
  constructor(props){
    super(props);
    this.addItem = this.addItem.bind(this);
    this.distroyList = this.distroyList.bind(this);
    this.deTodoNum = this.deTodoNum.bind(this);
    this.inTodoNum = this.inTodoNum.bind(this);
    this.deDoneNum = this.deDoneNum.bind(this);
    this.inDoneNum = this.inDoneNum.bind(this);
    this.state = {items: [], opened:true, todoNum:0, doneNum:0};
  }
  inTodoNum(){
    this.setState(prevState=>({todoNum: prevState.todoNum + 1}));
    this.props.updateTotalNum('T', 'I');
  }
  deTodoNum(){
    this.setState(prevState=>({todoNum: prevState.todoNum - 1}));
    this.props.updateTotalNum('T', 'D');
  }
  inDoneNum(){
    this.setState(prevState=>({doneNum: prevState.doneNum + 1}));
    this.props.updateTotalNum('D', 'I');
  }
  deDoneNum(){
    this.setState(prevState=>({doneNum: prevState.doneNum - 1}));
    this.props.updateTotalNum('D', 'D');
  }
  distroyList(){
    console.log("HELLLO");
    this.setState(prevState=>({opened:false}));
    for(let i = 0; i < this.state.todoNum; i++){
      this.deTodoNum();
    }
    for(let i = 0; i < this.state.doneNum; i++){
      this.deDoneNum();
    }
  }
  addItem(item){
    console.log("addItems");
    console.log(this.state.items);
    this.inTodoNum();
    this.setState(prevState=>({
      items: [...this.state.items, item]
    }));
  }
  render(){
    var title = "TodoList" + this.props.idx;
    var disp = "";
    if(!this.state.opened)disp="none";
    var style = {
      display: disp
    };
    
    return (
      <div id={title} className="TODOList" style={style}>
        <ListTitle title={title} addItem={this.addItem} distroyList={this.distroyList} todoNum={this.state.todoNum} deTodoNum={this.deTodoNum} inTodoNum={this.inTodoNum} deDoneNum={this.deDoneNum} inDoneNum={this.inDoneNum} doneNum={this.state.doneNum}/>
        <ul id="TODOItems">
          {this.state.items}
        </ul>
      </div>
    );
  }
}
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {lists: [], totalTodoNum:0, totalDoneNum:0};
    this.newList = this.newList.bind(this);
    this.increaseTotalTodoNum = this.increaseTotalTodoNum.bind(this);
    this.decreaseTotalTodoNum = this.decreaseTotalTodoNum.bind(this);
    this.increaseTotalDoneNum = this.increaseTotalDoneNum.bind(this);
    this.decreaseTotalDoneNum = this.decreaseTotalDoneNum.bind(this);
    this.updateTotalNum = this.updateTotalNum.bind(this);
  }
  updateTotalNum(type, inOrDe){
    if(type === 'T'){//for Todo
      if(inOrDe === 'I'){
        this.increaseTotalTodoNum();
      }else{
        this.decreaseTotalTodoNum();
      }
    }else{//for Done
      if(inOrDe === 'I'){
        this.increaseTotalDoneNum();
      }else{
        this.decreaseTotalDoneNum();
      }
    }
  }
  increaseTotalTodoNum(){
    this.setState(prevState=>({totalTodoNum: prevState.totalTodoNum + 1}));
    console.log(">>> tTodo + 1: " + this.state.totalTodoNum);
  }
  decreaseTotalTodoNum(){
    this.setState(prevState=>({totalTodoNum: prevState.totalTodoNum - 1}));
    console.log(">>> tTodo - 1: " + this.state.totalTodoNum);
  }
  increaseTotalDoneNum(){
    this.setState(prevState=>({totalDoneNum: prevState.totalDoneNum + 1}));
    console.log(">>> tDone + 1: " + this.state.totalDoneNum);
  }
  decreaseTotalDoneNum(){
    this.setState(prevState=>({totalDoneNum: prevState.totalDoneNum - 1}));
    console.log(">>> tDone - 1: " + this.state.totalDoneNum);
  }
  newList(){
    var l = this.state.lists;
    l.push(
       <TodoList idx={l.length} updateTotalNum={this.updateTotalNum}/>
    );//XXX: How can I trace this.prop value in dev tool
    //XXX:Warning: Each child in an array or iterator should have a unique "key" prop.
    console.log(">>> Push!")
    this.setState(prevState=>({lists: l}))
  }

  render(){
    return (
      <div id="App">
        <h1>
          TODO List by {this.props.name}
          <span className="newListBtn" onClick={this.newList}>+</span>
        </h1>
        <p id="TotalNum">Unfinished items: {this.state.totalTodoNum}, and Finished items: {this.state.totalDoneNum}</p>
        <div id="listBlock">
          {this.state.lists/*XXX: why did the comment must be put in div*/}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App name="Bunch"/>, document.getElementById('root'));
