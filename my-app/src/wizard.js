import React from 'react';

import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
};

export default class Wizard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    	value:props.value
    }
  }
  componentWillReceiveProps(nextProps){
	if(nextProps.value && nextProps.value.answer){
		this.setState({
			value:nextProps.value.answer
		});
	}
  }
  _drawRadioButton(AnswerList,type){
  	if(type==="radio"){
	  	return AnswerList.map((el,i)=>{
	  		return (<RadioButton
	  					id={i}
	  					key={i}
				        value={el}
				        label={el}
				        style={styles.radioButton}
				    />)
	  	});
	}else if(type==="dropdown"){
		return AnswerList.map((el,i)=>{
	  		return (<MenuItem 
	  					key={i}
	  					value={el}
	  					primaryText={el}
	  				/>)
	  	});
	}
  }
  _handleChange(type,event,index,value){
  	let dataObj={};
  	if(type==="radio"){
  		dataObj.currentIndex=this.props.currentIndex;
  		dataObj.type=type;
  		dataObj.question=this.props.data.title;
  		dataObj.answer=index;
  		this.props.handleSubmit(dataObj);
  	}
  	else{
  		dataObj.currentIndex=this.props.currentIndex;
  		dataObj.type=type;
  		dataObj.question=this.props.data.title;
  		dataObj.answer=value;
  		this.props.handleSubmit(dataObj);
  		this.setState({
	  		value:value
	  	})
  	}
  }
  _drawAnswersUI(){
  	let renderUI = [];
  	if(this.props.data && this.props.data.options){
  		if(this.props.data.type === "radiogroup"){
	  		renderUI.push(<RadioButtonGroup key="radio" valueSelected={this.state.value} name="QuestionGroup" onChange={this._handleChange.bind(this,'radio')}>
	  			{this._drawRadioButton(this.props.data.options,'radio')}
	  		</RadioButtonGroup>);
		}else if(this.props.data.type === "dropdown"){
	  		renderUI.push(<DropDownMenu key="dropdown" value={this.state.value} onChange={this._handleChange.bind(this,'dropdown')}>
	  			{this._drawRadioButton(this.props.data.options,'dropdown')}
	        </DropDownMenu>);
	    }
	    return renderUI;
  	}else return null;
  }
  render(){
  	return (<div>
  		<h4>{this.props.data && this.props.data.title}</h4>
  		<div className="wizardWrapper">
  			{this._drawAnswersUI()}
	  	</div>
  	</div>);
  }
}