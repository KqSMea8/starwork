import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Input, message,Col,Radio,Checkbox,Collapse,notification,Button,Slider,Select,Upload} from 'antd';
import request from "../util/request";
import * as jobService from "../service/jobs";
import reqwest from "reqwest";
class videoProducePage extends Component {
state={
  worksTypes: "",
  videoIdReady:false,
  videoName:"",
  videoUrlList:[""],
  videoSource:"qipu",
  starIdReady:false,
  starName:"",
  comedyTemplates: {
    1:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/ed/starworks_template_1.jpeg",
    2:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/1c/starworks_template_2.jpeg",
    3:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/4a/starworks_template_3.jpeg",
    4:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/78/starworks_template_4.jpeg",
    5:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/a6/starworks_template_5.jpeg",
    6:"http://bjyunlou11.oss.qiyi.storage:8080/v1/AUTH_6844dffdec0f410191807106ff44f50f/d4/starworks_template_6.jpeg",
  },
  comedyTemplateId: 1,
  relayScreenNum: 3,
  relayTypes : [1],
  fileList: [],
  taskType: "screen_relay",
}
  onClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.worksTypes.toString() === tag.value.toString()) {
      this.setState({
        worksTypes: '',
      });
    }
  }
  onChange = (e) => {
    console.log("worksTypes:", e.target.value);
    this.setState({
      worksTypes: e.target.value
    });
  };
  videoNameChanged = (e) => {
    console.log("videoName:", e.target.value);
    this.setState({
      videoName: e.target.value
    },this.getVideoIdByName)
  };
  starNameChanged = (e) => {
    console.log("starName:", e.target.value);
    this.setState({
      starName: e.target.value
    }, this.getStarIdByName)
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
  getStarIdByName = () => {
    if(this.state.starName.trim() === ""){
      this.setState({
        starId: undefined,
        starIdReady: false
      })
    } else if(!isNaN(this.state.starName)){
      this.setState({
        starId: parseInt(this.state.starName),
        starIdReady: true
      })
    } else {
      let result = request(`/apis/views/name2id?type=3&name=${this.state.starName}`);
      result.then((r) => {
        console.log("star id:", r.result.id);
        if (r.result && r.result.id && r.result.id !== 0) {
          this.setState({
            starId: r.result.id,
            starIdReady: true
          })
        } else {
          this.setState({
            starId: undefined,
            starIdReady: false
          })
        }
      });
    }
  };
  videoUrlListRemove = (i) => {
    let videoUrlList = this.state.videoUrlList;
    console.log("videoUrlList:", videoUrlList);
    videoUrlList.splice(i, 1);
    this.setState({
      videoUrlList: videoUrlList
    });
  };
  videoUrlListAppend = () => {
    let videoUrlList = this.state.videoUrlList;
    console.log("videoUrlList:", videoUrlList);
    this.setState({
      videoUrlList: videoUrlList.concat("")
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
  onRelayScreenNumChanged = (relayScreenNum) => {
    this.setState({relayScreenNum : relayScreenNum});
  };
  onRelayTypesChange = (checkedValues) => {
    console.log('relay types checkbox checked', checkedValues);
    this.setState({
      relayTypes: checkedValues
    });
  };
  onTemplateChange = (value) => {
    this.setState({
      comedyTemplateId: value,
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
  }
  onSubmit = (e) => {
    console.log("job submit");
    this.jobSubmit();
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
    const InputGroup = Input.Group;
    const Panel = Collapse.Panel;
    const Dragger = Upload.Dragger;
    const relayTypesOptions = [
      { label: '顺序接力', value: 1 },
      { label: '分段接力', value: 2 },
      { label: '正反放', value: 3 },
    ];
    return (
      <div onClick={this.onClick}>
      <h2 style={{textAlign:"center"}}>AIworks生产</h2>
    <Col span={20}>
      <Col span={24} style={{marginTop: 16}}>
        <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
            <label>Works类型: </label>
        </Col>
        <Col span={18}>
            <RadioGroup buttonStyle="solid" onChange={this.onChange} value={this.state.worksTypes}>
            <RadioButton value="a" style={{marginLeft:"10px"}}>明星</RadioButton>
            <RadioButton value="b" style={{marginLeft:"10px"}}>极限运动</RadioButton>
            <RadioButton value="c" style={{marginLeft:"10px"}}>搞笑视频</RadioButton>
            <RadioButton value="d" style={{marginLeft:"10px"}}>台词视频</RadioButton>
            <RadioButton value="e" style={{marginLeft:"10px"}}>体育</RadioButton>
            <RadioButton value="f" style={{marginLeft:"10px"}}>新闻</RadioButton>
            </RadioGroup>
        </Col>
      </Col>
     </Col>
      <Col span={20}>
        <Col span={24} style={{marginTop: 16}}>
          <Col span={8} style={{textAlign: "right", paddingRight: 16, fontSize: "1.0em"}}>
           <label>是否混剪: </label>
          </Col>
         <Col span={16}>
           <Checkbox style={{marginLeft:"10px"}}>是</Checkbox>
           <Checkbox style={{marginLeft:"10px"}}>否</Checkbox>
         </Col>
        </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
         <Col span={5} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
              <label>搜索: </label>
         </Col>
            <Col span={4}>
              <InputGroup compact>
                 <Input style={{ width: 180}}
                 placeholder="明星姓名或ID"
                 value={this.state.videoName}
                 onChange={e => this.starNameChanged(e)}
                 prefix={!!this.state.starId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> :
                 <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                 />
              </InputGroup>
            </Col>
         <Col span={4}>
            <InputGroup compact>
              <Input style={{ width: 180}}
               placeholder="剧集名或ID"
               value={this.state.videoName}
               onChange={e => this.videoNameChanged(e)}
               prefix={!!this.state.videoId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> :
               <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
               />
             </InputGroup>
         </Col>
         <Col span={5}>
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
                 return (<Input addonAfter={buttons} style={{ width: 220}} value={this.state.videoUrlList[i]} placeholder={"视频地址"} onChange={(e) => this.onVideoUrlChange(e, i)}/>)
               })}
         </Col>
         <Col span={4}>
              <InputGroup compact >
                  <Input style={{ width: 180}}
                  placeholder="台词"
                  value={this.state.videoName}
                  onChange={e => this.videoNameChanged(e)}
                   prefix={!!this.state.videoId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> :
                  <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                   />
              </InputGroup>
         </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
          <Col span={5} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
                <label>制作方式：</label>
          </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
            <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
                <label>风格：</label>
            </Col>
            <Col span={18}>
                <RadioGroup buttonStyle="solid" onChange={this.onChange} value={this.state.worksTypes}>
                <RadioButton value="a" style={{marginLeft:"10px",fontSize: "1.0em"}}>古装</RadioButton>
                <RadioButton value="b" style={{marginLeft:"10px",fontSize: "1.0em"}}>杂志</RadioButton>
                <RadioButton value="c" style={{marginLeft:"10px",fontSize: "1.0em"}}>广告</RadioButton>
                <RadioButton value="d" style={{marginLeft:"10px",fontSize: "1.0em"}}>卡通</RadioButton>
                </RadioGroup>
            </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
            <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
                    <label>内容：</label>
            </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
            <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.0em"}}>
               <label>人物关系：</label>
            </Col>
            <Col span={17}>
                  <RadioGroup buttonStyle="solid" onChange={this.onChange} value={this.state.worksTypes}>
                  <RadioButton value="a" style={{marginLeft:"10px",fontSize: "0.8em"}}>单人</RadioButton>
                  <RadioButton value="b" style={{marginLeft:"10px",fontSize: "0.8em"}}>CP</RadioButton>
                  <RadioButton value="c" style={{marginLeft:"10px",fontSize: "0.8 em"}}>群像</RadioButton>
                  </RadioGroup>
            </Col>
       </Col>
       <Col span={24} style={{marginTop: 16}}>
            <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.0em"}}>
                  <label>动作：</label>
            </Col>
            <Col span={17}>
                  <RadioGroup buttonStyle="solid" onChange={this.onChange} value={this.state.worksTypes}>
                  <RadioButton value="a" style={{marginLeft:"10px",fontSize: "0.8em"}}>舞蹈</RadioButton>
                  <RadioButton value="b" style={{marginLeft:"10px",fontSize: "0.8em"}}>打斗</RadioButton>
                  <RadioButton value="c" style={{marginLeft:"10px",fontSize: "0.8 em"}}>吻戏</RadioButton>
                  </RadioGroup>
           </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
           <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.0em"}}>
                 <label>表情：</label>
           </Col>
           <Col span={17}>
                  <RadioGroup buttonStyle="solid" onChange={this.onChange} value={this.state.worksTypes}>
                  <RadioButton value="a" style={{marginLeft:"10px",fontSize: "0.8em"}}>微笑</RadioButton>
                  <RadioButton value="b" style={{marginLeft:"10px",fontSize: "0.8em"}}>哭泣</RadioButton>
                  <RadioButton value="c" style={{marginLeft:"10px",fontSize: "0.8 em"}}>翻白眼</RadioButton>
                  </RadioGroup>
           </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
          <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.0em"}}>
                 <label>台词：</label>
          </Col>
          <Col span={17}>
                <Checkbox style={{marginLeft:"10px"}}>是</Checkbox>
                <Checkbox style={{marginLeft:"10px"}}>否</Checkbox>
          </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
          <Col span={6} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
                <label>特效：</label>
          </Col>
     </Col>
     <Col span={24} style={{marginTop: 16}}>
           <Col span={8} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
                <label>播放形式：</label>
           </Col>
    </Col>
    <Col span={24} style={{marginTop: 16}}>
           <Col span={9} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
               <label>分屏数量：</label>
           </Col>
           <Col span={15}>
                <Slider style={{width:400}} min={2} max={5} defaultValue={this.state.relayScreenNum} onChange={this.onRelayScreenNumChanged}
                    marks={{2: "2", 3: {style: {color: '#f50'}, label: <strong>3</strong>}, 4: "4", 5: "5"}}/>
           </Col>
    </Col>
    <Col span={24} style={{marginTop: 16}}>
           <Col span={9} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
               <label>多屏接力：</label>
           </Col>
           <Col span={15}>
              <Checkbox style={{marginLeft:"10px"}}>是</Checkbox>
              <Checkbox style={{marginLeft:"10px"}}>否</Checkbox>
           </Col>
    </Col>
    <Col span={24} style={{marginTop: 16}}>
          <Col span={9} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
              <label>接力类型: </label>
          </Col>
          <Col span={15} >
              <Checkbox.Group options={relayTypesOptions}
              defaultValue={this.state.relayTypes}
              onChange={this.onRelayTypesChange} />
          </Col>
    </Col>
    <Col span={24} style={{marginTop: 16}}>
          <Col span={8} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
             <label>转场特效：</label>
          </Col>
          <Col span={16}>
              <Checkbox style={{marginLeft:"10px"}}>是</Checkbox>
              <Checkbox style={{marginLeft:"10px"}}>否</Checkbox>
          </Col>
     </Col>
     <Col span={24} style={{marginTop: 16}}>
          <Col span={8} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
             <label>背景模板：</label>
          </Col>
     </Col>
     <Col span={24} style={{marginTop: 16}}>
          <Col span={8} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
               <label>动态：</label>
          </Col>
          <Col span={16}>
               <Checkbox style={{marginLeft:"10px"}} onChange={this.onTemplateChange}>高斯模糊</Checkbox>
          </Col>
     </Col>
     <Col span={24} style={{marginTop: 16}}>
          <Col span={8} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
              <label>静态：</label>
          </Col>
          <Col span={16}>
            <Select
             style={{ width: 200}}
             defaultValue={1}
             value={this.state.comedyTemplateId}
             onChange = {this.onTemplateChange}
             >
             <Option value="1">模板一</Option>
             <Option value="2">模板二</Option>
             <Option value="3">模板三</Option>
             <Option value="4">模板四</Option>
             <Option value="5">模板五</Option>
             <Option value="6">模板六</Option>
             </Select>
          </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
          <Col span={9}>
              <img style={{height: "360px",paddingLeft:420}} src={this.state.comedyTemplates[this.state.comedyTemplateId]} alt={""}/>
          </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
           <Col span={8} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
             <label>音乐：</label>
           </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
           <Col span={9} style={{textAlign: "right", paddingRight: 16, fontSize: "1.0em"}}>
             <label>类型：</label>
           </Col>
           <Col span={15}>
            <RadioGroup buttonStyle="solid" onChange={this.onChange} value={this.state.worksTypes}>
            <RadioButton value="a" style={{marginLeft:"10px",fontSize: "0.8em"}}>古典</RadioButton>
            <RadioButton value="b" style={{marginLeft:"10px",fontSize: "0.8em"}}>现代</RadioButton>
            <RadioButton value="c" style={{marginLeft:"10px",fontSize: "0.8 em"}}>热歌</RadioButton>
            <RadioButton value="d" style={{marginLeft:"10px",fontSize: "0.8 em"}}>原声</RadioButton>
            </RadioGroup>
           </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
           <Col span={5} style={{textAlign: "right", paddingRight: 16, fontSize: "1.2em"}}>
               <label>生产方式：</label>
           </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
           <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
               <label>是否批量：</label>
           </Col>
            <Col span={17}>
               <Checkbox style={{marginLeft:"10px"}}>是</Checkbox>
            </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
            <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
               <label>生产数量：</label>
            </Col>
            <Col span={17} style={{width: 300}}>
               <Input placeholder="100" />
            </Col>
      </Col>
      <Col span={24} style={{marginTop: 16}}>
            <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
               <label>片段时长：</label>
            </Col>
            <Col span={17} style={{width: 300}}>
               <Select defaultValue="1" style={{ width: 300 }}>
               <Option value="1">15-30秒</Option>
               <Option value="2">30-45秒</Option>
               <Option value="3">45-60秒</Option>
               </Select>
            </Col>
     </Col>
     <Col span={24} style={{marginTop: 16}}>
           <Col span={7} style={{textAlign: "right", paddingRight: 16, fontSize: "1.1em"}}>
               <label>批量上传：</label>
           </Col>
           <Col span={17} style={{width: 300}}>
              <Dragger name={"file"} multiple={false}
               onRemove={(file) => this.onUploaderRemove(file)}
               beforeUpload={(file) => this.beforeUpload(file)}
               accept={".xlsx"}>
              <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或者把文件拖入该区域</p>
              </Dragger>
           </Col>
     </Col>
     <Col span={24} style={{textAlign: "center", marginTop: 16}}>
           <Col span={20}>
             <Button type={"primary"} size={"large"} onClick={this.onSubmit}>提交</Button>
           </Col>
     </Col>
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

export default  connect(mapStateToProps)(videoProducePage)
