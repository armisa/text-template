//stylings
var headerStyle = {
  paddingRight: '150px'
};

var textboxStyle = {
  width: '40%',
  height: '500px',
  borderStyle: 'solid',
  padding: '3px',
  background: 'whitesmoke',
  borderColor: 'black'
}

var resultStyle = {
  borderStyle: 'none',
  background: 'none',
  width: '40%',
  height: '500px',
  padding: '3px'
}

//whole project skeleton as react element
var TemplateProject = React.createClass({
  getInitialState: function() {
    return {
      numInputTags: 3,
      text: "Default text!",
      filteredText: "Default text!",
      inputMap: {}
    };
  },
  render: function() {
    return (
      <div>
      <br />
      <button onClick={this.addInput}>New Input</button>
      <br/>
      <label style={headerStyle}>Name</label>
      <label style={headerStyle}>Default</label>
      <label style={headerStyle}>Use</label>
      <br />
      <InputTagList numInputTags={this.state.numInputTags} insertLabel={this.insertLabel} updateInputMap={this.updateInputMap} />
      <br />
      <InputTextbox text={this.state.text} textChanged={this.textChanged} />
      <textarea style={resultStyle} value={this.state.filteredText} onChange={this.consoleAppeaser} />
      </div>
    );
  },
  addInput: function() {
    this.setState({
      numInputTags: this.state.numInputTags + 1
    });
  },
  textChanged: function(evt){
    this.setState({
      text: evt.target.value,
      filteredText: this.filterText(evt.target.value)
    });
  },
  filterText: function(text){
    var map = this.state.inputMap;
    for( var tag in map ){
      if( map.hasOwnProperty(tag) ){
        var re = new RegExp("{" + map[tag].name + "}","g");
        text = text.replace(re, function replace(x){return map[tag].use ? map[tag].use : map[tag].defaultText });
      }
    }
    return text;
  },
  insertLabel: function(name){
    var newText = this.state.text + "{" + name + "}";
    this.setState({
      text: newText,
      filteredText: this.filterText(newText)
    });
  },
  updateInputMap: function(newMap) {
    var updatedMap = this.state.inputMap;
    delete updatedMap[newMap.name];
    updatedMap[newMap.newValue.name] = newMap.newValue;
    this.setState({
      inputMap: updatedMap
    });
    this.setState({
      filteredText: this.filterText(this.state.text)
    });
  },
  consoleAppeaser: function() {

  }
});

//input textbox
var InputTextbox = React.createClass({
  render: function() {
    return (
      <textarea style={textboxStyle} value={this.props.text} onChange={this.props.textChanged} />
    );
  }
});

//collection of all input tags
var InputTagList = React.createClass({
  getInitialState: function() {
    return {
      numInputTags: 5
    };
  },
  render: function() {
    var inputs = [];
    for (var i = 0; i < this.props.numInputTags; i++){
      inputs.push(<InputTagCluster key={i} insertLabel={this.props.insertLabel} initialName={"Name" + i} updateInputMap={this.props.updateInputMap} />);
    }
    return (
      <div class="tag-input-cluster-list">
      {inputs}
      </div>
    );
  }
});

var InputTagCluster = React.createClass({
  getInitialState: function(){
    return {
      name: this.props.initialName,
      defaultText: "test",
      use: ""
    };
  },
  componentWillMount: function(){
    this.props.updateInputMap({ newValue: this.state })
  },
  render: function() {
    return (
      <div>
      <input value={this.state.name} onChange={this.updateName} />
      <input value={this.state.defaultText} onChange={this.updateDefault} />
      <input value={this.state.use} onChange={this.updateUse} />
      <button onClick={this.insertLabel}>Add</button>
      </div>
    );
  },
  insertLabel: function(){
    this.props.insertLabel(this.state.name);
  },
  updateName: function(evt){
    this.props.updateInputMap({
      name: this.state.name,
      newValue: {
        name: evt.target.value,
        defaultText: this.state.defaultText,
        use: this.state.use
      }
    });
    this.setState({
      name: evt.target.value
    });
  },
  updateDefault: function(evt){
    this.props.updateInputMap({
      name: this.state.name,
      newValue: {
        name: this.state.name,
        defaultText: evt.target.value,
        use: this.state.use
      }
    });
    this.setState({
      defaultText: evt.target.value
    });
  },
  updateUse: function(evt){
    this.props.updateInputMap({
      name: this.state.name,
      newValue: {
        name: this.state.name,
        defaultText: this.state.defaultText,
        use: evt.target.value
      }
    });
    this.setState({
      use: evt.target.value
    });
  }
});

ReactDOM.render(
  <TemplateProject />,
  document.getElementById('content')
)

/**
* Replaces every instance of [filler] with appropriate value
**/
var applyTemplate = function(){
  var template = $("#template")[0]; //the template DOM element

  //for each filler input
  $.each($(".filler"), function(index, obj){
    var contents = obj.value;
    var templateString = template.value;
    template.innerHTML = templateString.replace("/\[" + contents + "\]/g", contents);
  });
};
