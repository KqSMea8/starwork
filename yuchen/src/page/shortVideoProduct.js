import React, { Component } from 'react';
// import Link from 'umi/link';
import { connect } from 'dva';
import * as jobService from '../service/jobs';

import request from "../util/request"

import reqwest from "reqwest"

import {
  Input,
  Button,
  Tabs,
  Col,
  Icon,
  Radio,
  Upload,
  Slider,
  Checkbox,
  notification,
  message
} from 'antd';
import RadioButton from "antd/es/radio/radioButton";

class SearchPage extends Component {

  state = {
    videoIdReady: false,
    videoId: undefined,
    videoName: "",
    taskType: "screen_relay",
    comedyTemplates: {
      1:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/ed/starworks_template_1.jpeg",
      2:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/1c/starworks_template_2.jpeg",
      3:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/4a/starworks_template_3.jpeg",
      4:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/78/starworks_template_4.jpeg",
      5:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/a6/starworks_template_5.jpeg",
      6:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/d4/starworks_template_6.jpeg",
    },
    comedyTemplateId: 0,
    relayScreenNum: 3,
    relayTypes : [1],
    videoUrlList :[""],
    videoSource: "qipu",
    fileList: []
  };

  videoNameChanged = (e) => {
    console.log("videoName:", e.target.value);
    this.setState({
      videoName: e.target.value
    },this.getVideoIdByName)
  };

  onTaskTypeChange = (e) => {
    console.log('task type radio checked', e.target.value);
    this.setState({
      taskType: e.target.value,
    });
  };

  getVideoIdByName = () => {
    if(this.state.videoName.trim() === ""){
      this.setState({
        videoId: undefined,
        videoIdReady: false
      })
    } else if(!isNaN(this.state.videoName)){
      this.setState({
        videoId: parseInt(this.state.videoName),
        videoIdReady: true
      })
    } else {
      let result = request(`/apis/views/name2id?type=2&name=${this.state.videoName}`);
      result.then((r)=>{
        if (r.result && r.result.id && r.result.id !== 0) {
          this.setState({
            videoId: r.result.id,
            videoIdReady: true
          })
        } else {
          this.setState({
            videoId: undefined,
            videoIdReady: false
          })
        }
      });
    }
  };

  onTemplateChange = (e) => {
    console.log('template radio checked', e.target.value);
    this.setState({
      comedyTemplateId: e.target.value,
    });
  };

  onRelayTypesChange = (checkedValues) => {
    console.log('relay types checkbox checked', checkedValues);
    this.setState({
      relayTypes: checkedValues
    });
  };

  onRelayScreenNumChanged = (relayScreenNum) => {
    this.setState({relayScreenNum : relayScreenNum});
  };

  onSubmit = (e) => {
    console.log("job submit");
    this.jobSubmit();
  };

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

  jobSubmit = () => {
    let payload = {taskType: this.state.taskType, templet_id: this.state.comedyTemplateId,
      screen_num: this.state.relayScreenNum, relay_types: this.state.relayTypes};

    if (this.state.taskType === "screen_relay"){
      if(this.state.videoSource === "qipu"){
        payload.qipuid = this.state.videoId;
      } else {
        payload.video_path_list = this.state.videoUrlList;
      }
    } else {
      payload.qipuid = this.state.videoId;
    }

    let result = jobService.createJob3in1(payload);
    result.then((response) =>{
      console.log("job submit response:", response);
      if (response.code === "A00000"){
        this.openNotification("恭喜",`任务提交成功,jobId:${response.jobId} taskId:${response.taskId}`);
      } else {
        this.openNotification("err...",`失败，原因:${response.msg}`, false);
      }
    });
  };

  videoUrlListAppend = () => {
    let videoUrlList = this.state.videoUrlList;
    console.log("videoUrlList:", videoUrlList);
    this.setState({
      videoUrlList: videoUrlList.concat("")
    });
  };

  videoUrlListRemove = (i) => {
    let videoUrlList = this.state.videoUrlList;
    console.log("videoUrlList:", videoUrlList);
    videoUrlList.splice(i, 1);
    this.setState({
      videoUrlList: videoUrlList
    });
  };

  onVideoUrlChange = (e, i) => {
    // console.log("value:", e.target.value," index:", i);
    let videoUrlList = this.state.videoUrlList;
    videoUrlList[i] = e.target.value;
    this.setState({
      videoUrlList: videoUrlList
    });
  };

  onVideoSourceChange = (e) => {
    console.log('video source changed', e.target.value);
    this.setState({
      videoSource: e.target.value,
    });
  };

  onUploaderChange = (info) => {
    const status = info.file.status;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('files', file);
    });

    this.setState({
      uploading: true,
    });

    reqwest({
      url: '/apis/collection/createJobByBatch',
      method: 'post',
      processData: false,
      data: formData,
      success: () => {
        this.setState({
          fileList: [],
          uploading: false,
        });
        message.success('任务提交成功');
      },
      error: () => {
        this.setState({
          uploading: false,
        });
        message.error('任务提交失败');
      },
    });
  };

  onUploaderRemove = (file) => {
    this.setState((state) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };

  beforeUpload = (file) => {
    this.setState(state => ({
      fileList: [...state.fileList, file],
    }));
    return false;
  };

  render() {
    console.log("props:", this.props);
    const RadioGroup = Radio.Group;
    const InputGroup = Input.Group;
    const relayTypesOptions = [
          { label: '顺序接力', value: 1 },
          { label: '分段接力', value: 2 },
          { label: '正反放', value: 3 },
        ];
    const TabPane = Tabs.TabPane;
    const Dragger = Upload.Dragger;
    return (
      <div>
        <h2 style={{textAlign:"center"}}>短视频生产</h2>
        <Tabs type={"card"}>
          <TabPane tab={"单个生产"} key={"1"}>
            <Col span={20}>
              <Col span={24} style={{marginTop: 16}}>
                <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                  <label>视频类型: </label>
                </Col>
                <Col span={18}>
                  <RadioGroup onChange={this.onTaskTypeChange} defaultValue={"screen_relay"}>
                    <RadioButton value={"screen_relay"}>多屏接力</RadioButton>
                    <RadioButton value={"comedy"}>搞笑相声</RadioButton>
                  </RadioGroup>
                </Col>
              </Col>
              <Col span={24} style={{marginTop: 16,display:this.state.taskType==="screen_relay"?"block":"none"}}>
                <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                  <label>视频来源: </label>
                </Col>
                <Col span={18}>
                  <RadioGroup onChange={this.onVideoSourceChange} defaultValue={"qipu"}>
                    <RadioButton value={"qipu"}>奇谱视频</RadioButton>

                    <RadioButton value={"urlList"}>视频地址</RadioButton>
                  </RadioGroup>
                </Col>
              </Col>
              <Col span={24} style={{marginTop: 16,display:this.state.taskType==="screen_relay"&&this.state.videoSource==="urlList"?"none":"block"}}>
                <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                  <label style={{display:this.state.taskType==="comedy"?"block":"none"}}>视频名称: </label>
                </Col>
                <Col span={18}>
                  <InputGroup compact style={{ width: '60%'}}>
                    <Input style={{ width: '60%'}}
                           placeholder="请输入剧集名或ID"
                           value={this.state.videoName}
                           onChange={e => this.videoNameChanged(e)}
                           prefix={!!this.state.videoId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> :
                             <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                    />
                    <Input disabled={true} style={{ width: '40%' }} value={this.state.videoId}/>
                  </InputGroup>
                </Col>
              </Col>
              <Col span={24} style={{marginTop: 16,display:this.state.taskType==="screen_relay"&&this.state.videoSource==="urlList"?"block":"none"}}>
                <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                </Col>
                <Col span={18}>
                  { this.state.videoUrlList.map((videoUrl, i) =>{
                    let iconStyle = "minus";
                    let iconColor = "#cc3333";
                    let onClickFn = () => this.videoUrlListRemove(i);
                    let buttons = (<Button onClick={onClickFn} icon={iconStyle} style={{color:iconColor}}/>);
                    if(i===this.state.videoUrlList.length-1){
                      iconStyle = "plus";
                      iconColor = "#66cc33";
                      onClickFn = this.videoUrlListAppend;
                      if (this.state.videoUrlList.length === 1){
                        buttons = (<Button onClick={onClickFn} icon={iconStyle} style={{color:iconColor}}/>);
                      } else {
                        buttons = (<div><Button onClick={() => this.videoUrlListRemove(i)} icon={"minus"} style={{color:"#cc3333"}}/>
                          <Button onClick={onClickFn} icon={iconStyle} style={{color:iconColor}}/></div>);
                      }
                    }
                    return (<Input addonAfter={buttons} value={this.state.videoUrlList[i]} placeholder={"视频地址"} onChange={(e) => this.onVideoUrlChange(e, i)}/>)
                  })}
                </Col>
              </Col>
              <Col span={24} style={{marginTop: 16,display:this.state.taskType==="screen_relay"?"block":"none"}}>
                <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                  <label>分屏数量: </label>
                </Col>
                <Col span={18}>
                  <Slider style={{width:"60%"}} min={2} max={5} defaultValue={this.state.relayScreenNum} onChange={this.onRelayScreenNumChanged}
                          marks={{2: "2", 3: {style: {color: '#f50'}, label: <strong>3</strong>}, 4: "4", 5: "5"}}/>
                </Col>
              </Col>
              <Col span={24} style={{marginTop: 16,display:this.state.taskType==="screen_relay"?"block":"none"}}>
                <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                  <label>接力类型: </label>
                </Col>
                <Col span={18}>
                  <Checkbox.Group options={relayTypesOptions}
                                  defaultValue={this.state.relayTypes} onChange={this.onRelayTypesChange} />
                </Col>
              </Col>
              <Col span={24} style={{display:this.state.taskType==="screen_relay"?"none":"block", marginTop: 16}}>
                <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                  <label>视频模板: </label>
                </Col>
                <Col span={9}>
                  <RadioGroup onChange={this.onTemplateChange} defaultValue={0}>
                    <RadioButton value={0}>高斯模糊</RadioButton>
                    <RadioButton value={1}>1</RadioButton>
                    <RadioButton value={2}>2</RadioButton>
                    <RadioButton value={3}>3</RadioButton>
                    <RadioButton value={4}>4</RadioButton>
                    <RadioButton value={5}>5</RadioButton>
                    <RadioButton value={6}>6</RadioButton>
                  </RadioGroup>
                </Col>
                <Col span={9}>
                  <img style={{height: "360px"}} src={this.state.comedyTemplates[this.state.comedyTemplateId]} alt={""}/>
                </Col>
              </Col>
              <Col span={24} style={{textAlign: "center", marginTop: 16}}>
                <Button type={"primary"} size={"large"} onClick={this.onSubmit}>提交</Button>
              </Col>
            </Col>
          </TabPane>
          <TabPane tab={"批量生产"} key={"2"}>
            <Dragger name={"file"} multiple={false}
                     onRemove={(file) => this.onUploaderRemove(file)}
                     beforeUpload={(file) => this.beforeUpload(file)}
                     accept={".xlsx"}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或者把文件拖入该区域</p>
            </Dragger>
            <Col span={24} style={{textAlign: "center", marginTop: 16}}>
              <Button type={"primary"} size={"large"} onClick={this.handleUpload}>提交</Button>
            </Col>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  console.log("mapStateToProps search result:{}", state.search.result);
  let result;
  if (state.search.result === undefined || state.search.result["totalNo"] === undefined){
    result = {"pageNo":1,"pageSize":20,"totalNo":0,"segs":[]};
  } else {
    result = state.search.result;
  }
  return {
    result: result
  };
}

export default connect(mapStateToProps)(SearchPage)
