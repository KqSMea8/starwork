import React, { Component } from 'react';
// import Link from 'umi/link';
import { connect } from 'dva';
import reqwest from 'reqwest';
import { Card, Icon, Input,Button,Col,Row } from 'antd';

const {Meta} = Card;
class nameIdPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
     actorName:"",
      actorId:"",
      imageUrl:"",
    }
  }
  state = {
    data: [],
    loading: false,
  };
  onActorNameChanged = (e) => {
    console.log("actorName:", e.target.value);
    this.setState({
      actorName:e.target.value,
    })
  };
  onSearchClick() {
    this.fetch();
  }


  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: `/apis/actor/listByName/${this.state.actorName}`,
      method: 'get',
      type: 'json',
    }).then((data) => {
      console.log('data:',data)
      this.setState({
        loading: false,
        data: data.data,
      },()=>{console.log("state after fetch:",this.state)});
    });
  }
  render() {

    return (
     <div>
       <div>
        <Input
          style={{ width: 500, left:45 }}
          placeholder="请输入关键字"
          value={this.state.actorName}
          onChange={e=>{this.onActorNameChanged(e)}}
          onPressEnter={e=> {this.onSearchClick(e)}}
        />
          <Button type="primary" style={{top:-1,left:45}} onClick={e=> {this.onSearchClick(e)}}>Search</Button>
                <hr style={{color:"darkgray"}}/>
       </div>


      {this.state.data&&this.state.data.map( (v) =>
         <div>
            <Row gutter={16}>
             <Card
               hoverable
                 style={{ width: 240 }}
                    cover={<img alt="example" src={v.imageUrl} />}
             >
             <Meta
             title={v.actorName}
             description={v.actorId}
             />
             </Card>
            </Row>
         </div>
     )}


    </div>
  );
  }
}

function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  return {
    resultList: state.search.resultList,
  };
}

export default  connect(mapStateToProps)(nameIdPage)
