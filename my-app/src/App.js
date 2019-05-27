/* This purpose of this app to render a set of questions along with it's option based on a given input data set and allow the user
    to choose one of these options and it finally shows the list of chosen options against each question.
    Additionaly, it also shows the percentage of filled form dynamically as progress.
*/

import React from 'react';

import './App.css';
import Wizard from './wizard.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

//following is the data set as mentioned in the description, we can make this dynamic based on api call etc.
const questions=[
  {id:'Q-101', index:0, title:'What is India\'s capital', type:'radiogroup', options:['Delhi','Mumbai','Kolkatta','Pune']},
  {id:'Q-103', index:1, title:"Grand Central Terminal, Park Avenue, New York is the world's", type:'radiogroup', options:['largest railway station','highest railway station','longest railway station','None of the above',]},
  {id:'Q-103', index:2, title:'Entomology is the science that studies', type:'dropdown', options:['Behavior of human beings','Insects','The origin and history of technical and scientific terms','The formation of rocks']}
];

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      showResult:false,
      currentIndex:0,
      answerArray:[],
      disableNext:true,
    }
  }
  _drawChildComponents(){
    if(questions && questions.length){
      return (<Wizard
                currentIndex={this.state.currentIndex}
                data={questions[this.state.currentIndex]}
                value={this.state.answerArray.length ? this.state.answerArray[this.state.currentIndex] : ''}
                handleSubmit={(data)=>{ this._handleInputValues(data) }}
              />)
    }else return null;
  }
  _handleInputValues(data){
    let {answerArray} = this.state;
    if(!answerArray.length){
      answerArray.push({
        index:data.currentIndex,
        question:data.question,
        answer:data.answer
      });
    }else if(answerArray.length){
      answerArray.forEach((el)=>{
        if(el.index === data.currentIndex){
          answerArray.splice(el.index,1);
        }
      });
      answerArray.push({
        index:data.currentIndex,
        question:data.question,
        answer:data.answer
      });
    }
    this.setState({disableNext:false});
  }
  _handleNext(){
    let {currentIndex,answerArray} = this.state;
    if(this.state.currentIndex === questions.length-1){
      this.setState({
        disableNext:true,
        showResult:true,
      })
    }else if(currentIndex < questions.length){
      this.setState({
        currentIndex:currentIndex+1,
        disableNext:((answerArray.length && answerArray[currentIndex+1] && answerArray[currentIndex+1].answer) ? false : true)
      });
    }
  }
  _handlePrev(){
    let {currentIndex,answerArray} = this.state;
    if(currentIndex > 0){
      this.setState({
        currentIndex:currentIndex-1,
        disableNext:((answerArray.length && answerArray[currentIndex-1] && answerArray[currentIndex-1].answer) ? false : true),
      });
    }
  }
  _handleReset(){
    this.setState({
        currentIndex:0,
        answerArray:[],
        disableNext:true,
        showResult:false,
      })
  }
  _drawResult(){
    let UiArr = [];
    if(this.state.answerArray && this.state.answerArray.length){
      UiArr.push(<h4 key="0">Here are your choices</h4>);
      this.state.answerArray.forEach((el,i)=>{
          UiArr.push(<div key={i+1} className="answer-wrapper">
                      <div>{el.question} : {el.answer}</div>
                    </div>);
      });
      UiArr.push(<FlatButton
                    key={this.state.answerArray.length+1}
                    label="Reset" 
                    primary={true}
                    onClick={()=>{ this._handleReset() }} />
                );
    }
    return UiArr;
  }
  _drawProgress(){
    let percent=0;
    let questionLength = questions.length;
    let answerLength = this.state.answerArray.length;
    percent = (answerLength/questionLength)*100;
    return(<div>
      <p>Progress : {parseInt(percent)} %</p>
    </div>)
  }
  render(){
    return (
      <MuiThemeProvider>
        <div className="App">
          <h2>Hi there! Welcome to my Wizard App</h2>
          <br/>
          {this._drawProgress()}
          {!this.state.showResult && this._drawChildComponents()}
          <br/>
          {!this.state.showResult && 
            <div className="action-button-wrapper">
              <FlatButton label="Previous" primary={true} disabled={this.state.currentIndex === 0 ? true : false} 
                          onClick={()=>{ this._handlePrev() }} />
              <FlatButton label={this.state.currentIndex === questions.length-1 ? "Submit" : "Next"} primary={true}
                          disabled={this.state.disableNext} 
                          onClick={()=>{ this._handleNext() }} />
          </div>}
          {this.state.showResult && this._drawResult()}
        </div>
      </MuiThemeProvider>
    );
  }
}


