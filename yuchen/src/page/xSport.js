import React, { Component } from 'react';
import { connect } from 'dva';

import { Card, Icon, Input, message,Col,Radio,Button,Upload, Switch,Select,notification, } from 'antd';
import videoProduce from "./videoProduce";

class xSportPage extends Component {
    state = {
      videoName:"",
      worksTypes: "",
      relayTypes:"",
      relayScreenNum:"",
      checked:"",
      channel:"",
      account:"",
      uploadNumber:"",
    };

  videoNameChanged = (e) => {
    console.log("videoName:", e.target.value);
    this.setState({
      videoName:e.target.value,
    })
  };
  onChange = (e) => {
    console.log("worksTypes:", e.target.value);
    this.setState({
      worksTypes: e.target.value,
    });
  };
  onUploadClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.worksTypes.toString() === tag.value.toString()) {
      this.setState({
        worksTypes: '',
      });
    }
  }
  onPlayClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.relayTypes.toString() === tag.value.toString()) {
      this.setState({
        relayTypes: '',
      });
    }
  }
  onPlayChange = (e) => {
    console.log('relayTypes:', e.target.value);
    this.setState({
      relayTypes: e.target.value,
    });
  };
  onRelayScreenNumChanged1 = (e) => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
      relayScreenNum:e.target.checked ? 2:"",
    })
  };
  onRelayScreenNumChanged2 = (e) => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
      relayScreenNum:e.target.checked ? 3:"",
    })
  };
  onRelayScreenNumChanged3 = (e) => {
    console.log('checked = ', e.target.checked);
    this.setState({
      checked: e.target.checked,
      relayScreenNum:e.target.checked ? 4:"",
    })
  };
  onChannelChanged = (value) => {
    console.log("channel:", value);
    this.setState({
      channel: value
    });
  };
  onAccountChanged = (value) => {
    console.log("account:", value);
    this.setState({
      account: value
    });
  };
  onuploadNumberChanged = (value) => {
    console.log("account:", value);
    this.setState({
      uploadNumber: value
    });
  };
  videoNameNotification = () => {
    notification.open({
      message: '提交错误',
      description: '任务名不能为空',
    });
  };
  qipuIdNotification = () => {
    notification.open({
      message: '提交错误',
      description: '奇谱ID不能为空或视频地址和标题不能为空',
    });
  };
  relayscreenNumNotification = () => {
    notification.open({
      message: '提交错误',
      description: '请选择分屏数量',
    });
  };
  relayTypesNotification = () => {
    notification.open({
      message: '提交错误',
      description: '请选择竖屏模式',
    });
  };
  infoNotification = () => {
    notification.open({
      message: '提交错误',
      description: '请选择分发信息',
    });
  };
  sportVideoProduce=()=>{
    let payload = {videoName:this.state.videoName,qipuId: this.state.videoId,relayscreenNum:this.state.relayscreenNum,channel:this.state.channel,account:this.state.account}
   if(this.state.videoName===""){
     this.videoNameNotification;
   }else {
     payload.videoName = this.state.videoName;
   }
     if(this.state.qipiId=== "" ) {
     this.qipuIdNotification;
   }else{
       payload.qipuId = this.state.videoId;
     }
     if (this.state.relayscreenNum === "" ){
       this.relayscreenNumNotification;
     }else{
       this.state.relayscreenNum = pauload.relayscreenNum;
     }if(this.state.relayTypes ==="") {
      this.relayTypesNotification;
    }else{
       payload.relayTypes = this.state.relayTypes;
    }
     if (this.state.channel||this.state.account ===""){
       this.infoNotification;
    }else {
      payload.account = this.state.account;
      payload.channel = this.state.channel;
    }
     let result = jobService.videoProduce(payload);
     result.then((response) =>{
      console.log("job submit response:", response);
      if (response.code === "A00000"){
        this.openNotification("恭喜",`任务提交成功,jobId:${response.jobId} taskId:${response.taskId}`);
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
    const RadioGroup = Radio.Group;
    const RadioButton = Radio.Button;
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      accept:'.xls',
      multiple:'true',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
       <div>
           <Col span={24} style={{marginTop: 16}}>
               <Col span={4} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                  <label>任务名称：</label>
               </Col>
               <Col span={20}>
                  <Input
                   style={{ width: 300}}
                   placeholder="请输入任务名称"
                   value={this.state.videoName}
                   onChange={this.videoNameChanged}
                  />
               </Col>
           </Col>
           <Col span={24} style={{marginTop: 16}}>
               <Col span={4} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                   <label>任务名称：</label>
               </Col>
               <Col span={20} onClick={this.onUploadClick}>
                 <RadioGroup buttonStyle="solid" onChange={this.onChange} value={this.state.worksTypes}>
                 <RadioButton value="a" style={{fontSize: "0.9em"}}>批量上传</RadioButton>
                 <RadioButton value="b" style={{fontSize: "0.9em"}}>单个视频</RadioButton>
                 </RadioGroup>
               </Col>
           </Col>
           <Col span={24} style={{marginTop:10}}>
               <Col span={6}>
                     <Upload {...props} >
                        <Button style={{width:100,left:210}} size="small"><Icon type="upload" /> 点击上传 </Button>
                     </Upload>
                </Col>
                <Col span={18}>
                    <p style={{fontSize: "0.6em",left:300}}>支持扩展名：.xls</p>
                </Col>
           </Col>
           <Col span={24} style={{marginTop: 16}}>
                <Col span={4} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                    <label>竖版模式：</label>
                </Col>
                <Col span={20} onClick={this.onPlayClick}>
                    <RadioGroup buttonStyle="solid" onChange={this.onPlayChange} value={this.state.relayTypes}>
                    <RadioButton value="1" style={{fontSize: "0.9em"}}>分段播放</RadioButton>
                    <RadioButton value="2" style={{marginLeft:"10px",fontSize: "0.9em"}}>接力播放</RadioButton>
                    <RadioButton value="3" style={{marginLeft:"10px",fontSize: "0.9em"}}>正放播放</RadioButton>
                    </RadioGroup>
                </Col>
           </Col>
           <Col span={24} style={{marginTop: 16}}>
                <Col span={4} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                    <label>分屏数量：</label>
                </Col>
                <Col span={20} onClick={this.onPlayClick}>
                    <Switch  unCheckedChildren="2" checked={this.state.checked} onChange={this.onRelayScreenNumChanged1} />
                    <Switch  unCheckedChildren="3" style={{marginLeft:"40px",fontSize: "0.9em"}}  onChange={this.onRelayScreenNumChanged2} />
                    <Switch  unCheckedChildren="4" style={{marginLeft:"40px",fontSize: "0.9em"}}  onChange={this.onRelayScreenNumChanged3} />
                </Col>
           </Col>
           <Col span={24} style={{marginTop: 16}}>
                <Col span={4} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                    <label>分发：</label>
                </Col>
                <Col span={5}>
                    < Select
                     defaultValue="姜饼"
                     style={{ width: 200}}
                     placeholder = "请输入渠道"
                     value={this.state.channel}
                     onChange = {e=>this.onChannelChanged(e)}
                    >
                      <Option value="1" >姜饼</Option>
                    </Select>
                </Col>
                <Col span={5}>
                    <Select
                     style={{ width: 200}}
                     placeholder = "请输入账号"
                     value={this.state.account}
                     onChange = {e=>this.onAccountChanged(e)}
                     >
                     <Option value="2" >星艺极限</Option>
                     </Select>
                </Col>
           </Col>
           <Col span={24} style={{marginTop: 16}}>
                <Col span={4} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                    <label>上传频次：</label>
                </Col>
                <Col span={20}>
                    <Select
                     style={{ width: 200}}
                     value={this.state.uploadNumber}
                     onChange = {e=>this.onuploadNumberChanged(e)}
                     >
                     <Option value="0" >不限</Option>
                     <Option value="1" >每小时1条</Option>
                     <Option value="2" >每小时5条</Option>
                     <Option value="3" >每小时10条</Option>
                     <Option value="4" >每小时50条</Option>
                     <Option value="5" >每小时100条</Option>
                     </Select>
                 </Col>
           </Col>
           <Col span={24} style={{marginTop: 16}}>
                 <Col span={4} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                    <Button size="large"  style={{width:150, left:300}} onClick={this.sportVideoProduce}>确认</Button>
                 </Col>
          </Col>
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

export default  connect(mapStateToProps)(xSportPage)
