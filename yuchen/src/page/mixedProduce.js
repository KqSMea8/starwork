import React, { Component } from 'react';
import reqwest from 'reqwest';
import {  Button,Col,Input,notification,Icon,} from 'antd';
import * as jobService from "../service/jobs";

class statisticsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      taskName:"",
      videoId:"",
      actorId:"",
    }
  }
  taskNameChanged = (e) => {
    console.log("taskName:", e.target.value);
    this.setState({
      taskName: e.target.value
    })
  };
  videoIdChanged = (e) => {
    console.log("videoId:", e.target.value);
    this.setState({
      videoId: e.target.value
    })
  };
  actorIdChanged = (e) => {
    console.log("actorId:", e.target.value);
    this.setState({
      actorId: e.target.value
    })
  };
  taskNameNotification = () => {
    notification.open({
      message: '提交错误',
      description: '任务名不能为空',
    });
  };
  onSubmit = () => {
    if (this.state.taskName === "") {
      this.taskNameNotification();
    } else {
      this.fetch();
    }
  }
    fetch = (params = {}) => {
      console.log('params:', params);
      this.setState({ loading: true });
      reqwest({
        url: `/apis/collection/smartHJ?videoId=${this.state.videoId||""}&actorId=${this.state.actorId||""}&taskName=${this.state.taskName}`,
        method: 'get',
        type: 'json',
      }).then((response) =>{
        console.log("job submit response:", response);
        if (response.code === "A00000"){
          this.openNotification("恭喜",`任务提交成功`);
        } else {
          this.openNotification("err...",`失败，原因:${response.msg}`, false);
        }
      });
    }
  openNotification = (title, desc, success=true) => {
    if (success){
      notification.open({
        message: title,
        description: desc,
        icon: <Icon type="smile" style={{ color: '#108ee9' }} />
    });
    } else {
      notification.open({
        message: title,
        description: desc,
        duration: null,
        icon: <Icon type="frown" style={{ color: '#cc6666' }} />
    });
    }
  };
  render() {
    return(
      <div>
        <Input.Group compact>
          <Col span={24} style={{marginTop: 16}}>
              <Col span={3} style={{textAlign: "right", paddingRight: 10, fontSize: "1.1em"}}>
                 <label>任务名称：</label>
              </Col>
              <Col span={4} >
                    <Input style={{ width: 200 }}
                       value={this.state.taskName}
                       onChange={e => this.taskNameChanged(e)}
                    />
              </Col>
          </Col>
       </Input.Group>
       <Input.Group compact>
         <Col span={24} style={{marginTop: 16}}>
             <Col span={3} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
                  <label>视频ID：</label>
            </Col>
          <Col span={4} >
                 <Input style={{ width: 200 }}
                   value={this.state.videoId}
                   onChange={e => this.videoIdChanged(e)}
                   />
          </Col>
          <Col span={3} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
                <label>人名ID：</label>
          </Col>
          <Col span={9} >
               <Input style={{ width: 200 }}
               value={this.state.actorId}
               onChange={e => this.actorIdChanged(e)}
               />
          </Col>
        </Col>
      </Input.Group>
       <Input.Group compact>
            <Button  style={{width:100,marginTop:25,left:350}} onClick={this.onSubmit}>提交</Button>
      </Input.Group>
    </div>
  );
  }
}
export default  statisticsPage
