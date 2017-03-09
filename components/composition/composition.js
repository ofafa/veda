// components/composition/composition.js
import React from "react";
import $ from 'jquery';


export default class Composition extends React.Component {
    constructor(props){
        super(props);
        let n = 10;
        //initialize input array
        let inputs = [];
        for (let i = 0; i < n; i++){
            let id = `item-${inputs.length}`;
            let newItem = {id:id, name:'', q:0, unit:'mace'};
            inputs.push(newItem);

        }
        this.state = {compo_name:'', inputs:inputs, type:'internal'};

        //initialize state


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

    }

    reset(){
        "use strict";
        let n = 5;
        //initialize input array
        let inputs = [];
        for (let i = 0; i < n; i++){
            let id = `item-${inputs.length}`;
            let newItem = {id:id, name:'', q:0, unit:'mace'};
            inputs.push(newItem);

        }
        this.setState({compo_name:'', inputs:inputs, compo_type:'internal', compo_intro:'', compo_limitation:'', compo_processing:'', compo_keyword:'', compo_price:0});
    }



    handleSubmit(e){
        "use strict";
        e.preventDefault();

        var data = JSON.stringify(this.state);


        $.ajax({
            type: 'POST',
            url: '/composition/add',
            data: data
        });
        this.reset();



    };

    handleItemChange(id, e){
        "use strict";
        let temp = this.state.inputs;
        temp.find(input => input.id === id).name = e.target.value;
        this.setState({inputs:temp});

    }

    handleQuantityChange(id, e){
        "use strict";
        let temp = this.state.inputs;
        temp.find(input => input.id === id).q = e.target.value;
        this.setState({inputs:temp});
    }

    handleUnitChange(id, e){
        "use strict";
        let temp = this.state.inputs;
        temp.find(input => input.id === id).unit = e.target.value;
        this.setState({inputs:temp});
    }

    handleNameChange(e){
        "use strict";
        this.setState({name: e.target.value});
    };

    handleTypeChange(e){
        "use strict";
        this.setState({type: e.target.value});
    }

    handleInputChange(e){
        "use strict";
        this.setState({[e.target.name]:e.target.value});
    }

    render(){
        return (
                <div>
                    <form name="compo_data" method="post" action="/composition/add" onSubmit={this.handleSubmit}>
                        <input type="text" name="compo_name" placeholder="compo_name" value={this.state.compo_name} onChange={this.handleInputChange}/>
                        <label for="type">type</label>
                        <select name="compo_type" onChange={this.handleInputChange}>
                            <option value="internal">internal</option>
                            <option value="external">external</option>
                            <option value="standard">standard</option>
                            <option value="other">other</option>
                        </select>
                        <div name="dynamicInput">
                            {this.state.inputs.map(input => {
                                //alert(input.id + "|" + input.name + "|" + input.q + "|" + input.unit);
                                return (
                                    <div name={input.id}>
                                        <input name="item-name" class="form-control" type="text" id={`${input.id}-item`} key={`${input.id}-item`} placeholder="item" value={input.name} onChange={this.handleItemChange.bind(this, input.id)}/>
                                        <input name="item-q" class="form-control" type="number" id={`${input.id}-q`} key={`${input.id}-q`} value={input.q} onChange={this.handleQuantityChange.bind(this, input.id)}/>
                                        <select name="item-unit" id={`${input.id}-unit`} key={`${input.id}-unit`} value={input.unit} onChange={this.handleUnitChange.bind(this, input.id)}>
                                            <option value="catty">catty斤</option>
                                            <option value="tael">tael兩</option>
                                            <option value="piece">piece個</option>
                                            <option value="mace">mace錢</option>
                                            <option value="g">g</option>
                                            <option value="kg">kg</option>
                                        </select>
                                        <br/>
                                    </div>
                                )
                            })}
                        </div>

                        <br/>
                        <input type="text" name="compo_intro" value={this.state.compo_intro} placeholder="intro" onChange={this.handleInputChange}/>
                        <input type="text" name="compo_limitation" value={this.state.compo_limitation} placeholder="limitation" onChange={this.handleInputChange}/>
                        <br/>
                        <input type="text" name="compo_processing" value={this.state.compo_processing} placeholder="processing" onChange={this.handleInputChange}/>
                        <input type="text" name="compo_keyword" value={this.state.compo_keyword} placeholder="keyword(sep by ,)" onChange={this.handleInputChange}/>
                        <input type="number" name="compo_price" placeholder="price" value={this.state.compo_price} onChange={this.handleInputChange}/>
                        <button class="btn btn-success" type="submit">save</button>
                    </form>

                    <button class="btn btn-default" onClick={() => this.appendInput() }>
                        Add item
                    </button>

                    <br/>
                    <hr/>

                    <a class="btn btn-default" href="/">Cancel</a>
                </div>
        );

    }

    appendInput(){
        /*
        let id = `input-${Object.keys(this.state.inputs).length}`;
        this.state.inputs[id] = [];
        this.state.inputs[id].name='test' + id;
        this.state.inputs[id].q = 0;
        this.state.inputs[id].unit = '';
        */
        let id = `item-${this.state.inputs.length}`;
        let newItem = {id:id, name:'', q:0, unit:'mace'};
        this.setState({inputs: this.state.inputs.concat(newItem)});
    }
}

