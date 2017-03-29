// components/composition/composition.js
import React from "react";
import $ from 'jquery';
import ReactDOM from 'react-dom';
import '../../public/js/dist/typeahead.min.jquery.js';
//const medicines = [{name:'牛七'},{name:'川七'},{name:'天花'}];

const getSuggestions = value => {
    "use strict";
    const inputVal = value.trim().toLowerCase();
    const inputLength = inputVal.length;

    return inputLength == 0? [] : medicines.filter(lang => lang.name.toLowerCase().slice(0, inputLength) === inputVal);
};


const substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substrRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};



export default class Composition extends React.Component {
    constructor(props){
        super(props);
        let n = 10;
        //initialize input array
        let inputs = [];
        for (let i = 0; i < n; i++){
            let id = `item_${inputs.length}`;
            let newItem = {id:id, name:'', q:0, unit:'mace'};
            inputs.push(newItem);

        }
        this.state = {
            compo_name:'',
            inputs:inputs,
            compo_type:'internal',
            compo_price_date: new Date().toISOString().substring(0, 10),
            compo_intro: '',
            compo_keyword:'',
            compo_limitation:'',
            compo_processing:'',
            compo_price:'',
            typedata:[]
        };


        //initialize state


        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleUnitChange = this.handleUnitChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }




    handleChange(newValue){
        this.setState({
            value: newValue
        });
    };


    componentDidUpdate(){
        "use strict";
        this.state.inputs.map(input => {
            let ref = input.id + '_name';
            if($(this.refs[ref]).hasClass('tt-input')==false){
                $(this.refs[ref]).typeahead({
                        hint: true,
                        hightlight: false,
                        minlength: 1
                    },{
                        name:'medicines',
                        source: substringMatcher(this.state.typedata)
                    }
                ).bind('typeahead:select', (e, suggestion) => {
                        let temp = this.state.inputs;
                        temp.find(item => item.id === input.id).name = suggestion;
                        this.setState({inputs:temp});
                    })
                    .bind('typeahead:change', (e, suggestion) => {
                        let temp = this.state.inputs;
                        temp.find(item => item.id === input.id).name = suggestion;
                        this.setState({inputs:temp});
                    });
            }
        });
    };


    componentDidMount(){
        "use strict";



        /* Bloodhound is not working within React component
        var medicines = new Bloodhound({

            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: test,
            prefetch: '../typedata.json'
        });

        medicines.initialize();
        */
        $.get('/typedata.json', (data) => {
            "use strict";
            this.state.typedata = data;
            this.state.inputs.map(input => {
                let ref = input.id + '_name';
                $(this.refs[ref]).typeahead({
                        hint: true,
                        hightlight: false,
                        minlength: 1
                    },{
                        name:'medicines',
                        source: substringMatcher(this.state.typedata)
                    }
                ).bind('typeahead:select', (e, suggestion) => {
                        let temp = this.state.inputs;
                        temp.find(item => item.id === input.id).name = suggestion;
                        this.setState({inputs:temp});
                    })
                    .bind('typeahead:change', (e, suggestion) => {
                        let temp = this.state.inputs;
                        temp.find(item => item.id === input.id).name = suggestion;
                        this.setState({inputs:temp});
                    });
            });
        });

    }

    reset(){
        "use strict";
        let n = 10;
        //initialize input array
        let inputs = [];
        for (let i = 0; i < n; i++){
            let id = `item_${inputs.length}`;
            let newItem = {id:id, name:'', q:0, unit:'mace'};
            inputs.push(newItem);

        }
        this.setState({compo_name:'', inputs:inputs, compo_type:'internal', compo_intro:'', compo_limitation:'', compo_processing:'', compo_keyword:'', compo_price:'', compo_price_date: new Date().toISOString().substring(0, 10)});
    }



    handleSubmit(e){
        "use strict";
        e.preventDefault();

        //var data = this.clearEmptyInput(this.state.inputs);
        $.ajax({
            type: 'POST',
            url: '/composition/add',
            contentType: "application/json",
            data: JSON.stringify({
                    compo_name: this.state.compo_name,
                    items: this.state.inputs,
                    compo_type: this.state.compo_type,
                    compo_intro: this.state.compo_intro,
                    compo_limitation: this.state.compo_limitation,
                    compo_processing: this.state.compo_processing,
                    compo_keyword: this.state.compo_keyword,
                    compo_price: this.state.compo_price,
                    compo_price_date: this.state.compo_price_date
                })
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

    clearEmptyInput(inputs){
        "use strict";
        let cleared = [];
        inputs.map(input => {
            if(input.name != ''){
                cleared.push(input);
            }
        });
        alert(cleared);
        return cleared;
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

    render(){
        "use strict";


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
                                return (
                                    <div name={input.id}>
                                        <input name="item-name" className="typeahead" autocomplete="off" ref={`${input.id}_name`} type="text" id={`${input.id}_name`} key={`${input.id}_name`} placeholder="item" value={input.name} onChange={this.handleItemChange.bind(this, input.id)}/>
                                        <input name="item-q" type="number" id={`${input.id}_q`} key={`${input.id}_q`} value={input.q} onChange={this.handleQuantityChange.bind(this, input.id)}/>
                                        <select name="item-unit" id={`${input.id}_unit`} key={`${input.id}_unit`} value={input.unit} onChange={this.handleUnitChange.bind(this, input.id)}>
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
                        <input type="date" name="compo_price_date" value={this.state.compo_price_date} noChange={this.handleInputChange}/>
                        <br/>
                        <button className="btn btn-success" type="submit">save</button>
                        <a href="/composition" class="btn btn-default">Cancel</a>



                    </form>

                    <button className="btn btn-default" onClick={() => this.appendInput() }>
                        Add item
                    </button>

                    <br/>
                    <hr/>

                    <a class="btn btn-default" href="/">Cancel</a>
                </div>
        );

    }


}

