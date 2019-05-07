import React, { Component } from 'react';
// import Link from 'umi/link';
import { connect } from 'dva';
import Player from "../assets/player.css"
import ReactHLS from 'react-hls'
import LazyLoad from "react-lazy-load"

import request from "../util/request"

import * as utils from "../util/commons"
import qs from 'query-string';
import { push } from 'react-router-redux';
import {
  Input,
  Modal,
  Pagination,
  Button,
  Row,
  Col,
  Select,
  Icon,
  Divider,
  BackTop,
  Affix,
  Drawer,
  Popconfirm,
  Radio,
  notification,
  Checkbox,
  Tag,
  Tooltip,
  Switch, Collapse, message,

} from 'antd';
import reqwest from "reqwest";
const Panel = Collapse.Panel;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const emotion = {0:"愤怒",1:"哭",2:"微笑",3:"笑",4:"大笑",5:"中立",6:"惊讶"};
const channelId = {1:"电影",2:"电视剧",6:"综艺"};
const gender = {0:"女",1:"男"};
const age = {0:"0-10岁",1:"10-18岁",2:"18-24岁",3:"24-32岁",4:"32-40岁",5:"40-50岁",6:"50-65岁",7:"65岁以上"};
const mask = {0:"有",1:"无"};
const faceQuality = {0:"大于85",1:"65-85",2:"40-65",3:"40以下"};
const glass = {0:"没有",1:"有墨镜",2:"有眼镜 "};
const nice = {0:"非常好看",1:"好看",2:"长得还行",3:"长得一般",4:"不太好看",5:"辣眼睛"};
const faceAngle = {0:"正脸",1:"左低头",2:"右低头",3:"左转脸",4:"右转脸"};
const scene = {
  "beach":"沙滩",
  "swimming_pool":"游泳池",
  "martial_arts_gym":"武术馆",
  "office":"办公室",
  "bedroom":"卧室",
  "bamboo_forest":"竹林",
  "ballroom":"舞厅",
  "living_room":"客厅",
  "laundromat":"自助洗衣店",
  "operating_room":"手术室",
  "banquet_hall":"宴会厅",
  "shower":"淋浴",
  "underwater/ocean_deep":"水下-深海",
  "basketball_court/indoor":"篮球场-室内",
  "football_field":"足球场",
  "gymnasium/indoor":"健身房-室内",
  "playroom":"游玩室",
  "hotel_room":"旅馆房间",
  "kindergarden_classroom":"幼儿园"};
  const action = {
    "using_computer":"使用电脑",
    "texting":"使用手机",
    "eating_watermelon":"吃西瓜",
    "balloon_blowing":"吹气球",
    "blowing_out_candles":"玩蜡烛(点蜡烛,吹蜡烛)",
    "playing_drums":"打鼓",
    "playing_violin":"拉小提琴",
    "hugging":"拥抱",
    "dining":"用餐",
    "marching":"排队,列队",
    "reading_newspaper":"看东西(书,报纸,杂志,平板电脑等)",
    "surfing_water":"冲浪",
    "scuba_diving":"潜水",
    "swimming_backstroke":"游泳",
    "swimming_breast_stroke":"游泳",
    "sailing":"坐船_开船_航行_划船",
    "canoeing_or_kayaking":"坐船_开船_航行_划船",
    "tasting_beer":"喝东西_喝水_喝酒",
    "passing_American_football_(in_game)":"传递美式足球（在游戏中",
    "cheerleading":"啦啦队",
    "punching_person_(boxing)":"打人_拳击",
    "playing_ice_hockey":"打冰球",
    "playing_squash_or_racquetball":"打壁球或者壁球",
    "playing_cello":"演奏大提琴",
    "driving_car":"驾车",
    "motorcycling":"骑摩托",
    "riding_a_bike":"骑自行车",
    "drinking":"喝东西",
    "smoking":"吸烟",
    "playing_poker":"玩扑克",
    "writing":"写字",
    "testifying":"作证",
    "taking_a_shower":"洗澡",
    "riding_or_walking_with_horse":"骑马",
    "kissing":"亲吻",
    "dancing_ballet":"跳舞",
};
class SearchPage extends Component {

  state = {
    pageSize:20,
    checked: false,
    checkedList: [],
    highlightSegments: new Set(),
    highlightStarId: null,
    highlightAlbumId: null,
    highlightVideoId: null,
    starIdSet: new Set(),
    albumIdSet: new Set(),
    videoIdSet: new Set(),
    key: "",
    videoUrl:"",
    playerVisible: false,
    generateVisible: false,
    checkedStarDisplay: "",
    checkedAlbumDisplay: "",
    checkedVideoDisplay: "",
    checkedDurationDisplay: "",
    paginationVisible:false,
    bgmQipuId: "",
    starIdReady: false,
    starId: undefined,
    starName: "",
    albumIdReady: false,
    albumId: undefined,
    albumName: "",
    videoIdReady: false,
    videoId: undefined,
    videoName: "",
    drawerVisible: false,
    taskType: 1,
    loading: false,
    Checked:true,
    indeterminate:true,
    checkAll:false,
    checkAllList:[],
    emotion:"",
    gender:"",
    age:"",
    mask:"",
    faceQuality:"",
    glass:"",
    nice:"",
    faceAngle:"",
    pageNo:"",
    channelId:"",
    scene:"",
    action:"",
    segmentSet: new Set(),
    startTime:"",
    endTime:"",
    segmentSet0: new Set(),
    segmentSet1: new Set(),
    check0:"",
  };

  onCheckboxChange=(v)=>{
    console.log("changed segment info", v);
    let segmentSet = this.state.segmentSet;
    let segmentKey = v.videoId + "_" + v.startTime + "_" + v.endTime;
    if (segmentSet.has(segmentKey)){
      segmentSet.delete(segmentKey);
    }else{
      segmentSet.add(segmentKey);
    }

    this.setState({
      segmentSet:segmentSet,
    }, this.compareChange);
    console.log('segmentSet:',segmentSet)
  }
  compareChange=()=>{
    let segmentSet1 = new Set();
    let segmentSet = this.state.segmentSet;
    console.log("segmentSet:", segmentSet)
    this.props.result.detail.forEach(v => {
      let segmentKey = v.videoId + "_" + v.startTime + "_" + v.endTime;
      segmentSet1.add(segmentKey);
    })
    console.log("segmentSet1:", segmentSet1)

    this.setState({
      checked: segmentSet.size == segmentSet1.size
    })
    console.log("this.state.checked",this.state.checked);
  }
  onCheckAllChange=(e)=>{
    let segmentSet0 = this.state.segmentSet0;
    if (!this.state.checked){
      this.props.result.detail.forEach(v => {
        let segmentKey = v.videoId + "_" + v.startTime + "_" + v.endTime;
        segmentSet0.add(segmentKey);
      })

    }else {
      segmentSet0.clear()
    }
    console.log('segmentSet0:',segmentSet0)
    this.setState({
      segmentSet: segmentSet0,
      checked: !this.state.checked
    });
  }
openDownload=(e)=> {

  let postData = {};
  postData["emotion"] = this.state.emotionName||[];
  postData["channelId"] = this.state.channelIdName||[];
  postData["nice"] = this.state.niceName||[];
  postData["gender"] = this.state.genderName||[];
  postData["glass"] = this.state.glassName||[];
  postData["mask"] = this.state.maskName||[];
  postData["faceAngle"] = this.state.faceAngleName||[];
  postData["faceQuality"] = this.state.faceQualityName||[];
  postData["age"] = this.state.ageName||[];
  postData["action"] = this.state.actionName||[];
  postData["scene"] = this.state.sceneName||[];
  postData["segmentList"] = this.getCheckedSegmentList();


  console.log("postData:",postData);
  fetch('/apis/segmentSearch/downloadSegmentInfo',{
    method:'POST',
    type:'json',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(postData),
  }).then((response) => {
    response.blob().then( blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      //不能直接创建一个<a>标签
      // let a = document.createElement('a_id');
      let a = document.getElementById('a_id');
      //无法从返回的文件流中获取文件名
      // let filename = response.headers.get('Content-Disposition');
      let filename = '视频信息.xlsx';
      a.href = blobUrl;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    });
  })
}

  getCheckedSegmentList(){
    let r = [];
    this.props.result.detail.forEach(v=>{
      if(this.state.segmentSet.has(v.videoId + "_" + v.startTime + "_" + v.endTime)){
        r.push(v);
      }
    })
    return r;
  }


  getColor = (qipuId, startSec) => {
    console.log("getColor");
    if(this.state.checked[qipuId + startSec]){
      return "#4EEE94 #4EEE94"
    }
    return "#c3c3c3 #c3c3c3";
  };

  componentDidMount() {
    window.setTimeout(this.init,0);
  }

  init = () => {
    console.log("query string:", this.props.location);
    const query = this.props.location.query||{};
    let starName = query.starName||"";
    let startId = query.starId||null;
    let albumName = query.albumName||null;
    let albumId = query.albumId||null;
    let videoName = query.videoName||null;
    let videoId = query.videoId||null;
    let pageSize = query.pageSize||20;
    let pageNo = query.pageNo||1;
    this.setState({
      starIdReady: true,
      starId: startId,
      starName: starName,
      albumIdReady: true,
      albumId: albumId,
      albumName: albumName,
      videoIdReady: true,
      videoId: videoId,
      videoName: videoName,
      pageSize: pageSize,
      pageNo:pageNo,
    }, () => this.search(pageNo));
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

  getAlbumIdByName = () => {
    if(this.state.albumName.trim() === ""){
      this.setState({
        albumId: undefined,
        albumIdReady: false
      })
    } else if(!isNaN(this.state.albumName)){
      this.setState({
        albumId: parseInt(this.state.albumName),
        albumIdReady: true
      })
    } else {
      let result = request(`/apis/views/name2id?type=1&name=${this.state.albumName}`);
      result.then((r) => {
        console.log("album id:", r.result.id);
        if (r.result && r.result.id && r.result.id !== 0) {
          this.setState({
            albumId: r.result.id,
            albumIdReady: true
          })
        } else {
          this.setState({
            albumId: undefined,
            albumIdReady: false
          })
        }
      });
    }
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
  setQueryString = (pageNo) => {
    let conditions = {
                      starId: this.state.starId,
                      starName: this.state.starName,
                      albumId: this.state.albumId,
                      albumName: this.state.albumName,
                      videoId: this.state.videoId,
                      videoName: this.state.videoName,
                      pageSize: this.state.pageSize,
                      emotion:this.state.emotion,
                      glass:this.state.glass,
                      channelId:this.state.channelId,
                      gender:this.state.gender,
                      age:this.state.age,
                      mask:this.state.mask,
                      faceQuality:this.state.faceQuality,
                      nice:this.state.nice,
                      faceAngle:this.state.faceAngle,
                      pageNo: this.state.pageNo,
                      scene:this.state.scene,
                      action:this.state.action,
                    };
    const queryString = qs.stringify(conditions);
    this.props.dispatch(push({
      search: queryString
    }));
  };

searchClick(pageNo){
  this.setState({
    loading:true
  });
  console.log("pageNo:" + pageNo);
  this.search(pageNo);
}

  search(pageNo) {
    this.setQueryString(pageNo);
    this.props.dispatch({
      type: 'search/search',
      payload: [this.state.starId, this.state.albumId, this.state.videoId, this.state.pageSize,this.state.channelId,this.state.emotion,this.state.gender,this.state.age,this.state.mask,this.state.faceQuality,this.state.nice,this.state.faceAngle,this.state.glass,this.state.pageNo]
    }).then(()=>this.setState({loading:false}));
  }

  sceneSearch(pageNo) {
    this.setQueryString(pageNo);
    this.props.dispatch({
      type: 'search/sceneSearch',
      payload: [this.state.starId,this.state.albumId,this.state.videoId,this.state.scene,this.state.pageSize,this.state.pageNo]
    }).then(()=>this.setState({loading:false}));
  }
  actionSearch(pageNo) {
    this.setQueryString(pageNo);
    this.props.dispatch({
      type: 'search/actionSearch',
      payload: [this.state.starId,this.state.albumId,this.state.videoId,this.state.action,this.state.pageSize,this.state.pageNo]
    }).then(()=>this.setState({loading:false}));
  }


  starNameChanged = (e) => {
    console.log("starName:", e.target.value);
    this.setState({
      starName: e.target.value
    }, this.getStarIdByName)
  };

  albumNameChanged = (e) => {
    console.log("albumName:", e.target.value);
    let albumName = e.target.value;
    this.setState({
      albumName: albumName,
    },this.getAlbumIdByName)
  };

  videoNameChanged = (e) => {
    console.log("videoName:", e.target.value);
    this.setState({
      videoName: e.target.value
    },this.getVideoIdByName)
  };

  emotionChanged = (e) => {
    console.log("emotion:", e.target.value);
    this.setState({
      emotion: e.target.value
    },this.searchClick)
  };
  onEmotionClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.emotion === tag.value) {
      this.setState({
        emotion: "",
      },this.searchClick);
    }
  }
  faceAngleChanged = (e) => {
    console.log("faceAngle:", e.target.value);
    this.setState({
      faceAngle: e.target.value
    },this.searchClick)
  };
  onFaceAngleClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.faceAngle === tag.value) {
      this.setState({
        faceAngle: "",
      },this.searchClick);
    }
  }
  niceChanged = (e) => {
    console.log("nice:", e.target.value);
    this.setState({
      nice: e.target.value
    },this.searchClick)
  };
  onNiceClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.nice === tag.value) {
      this.setState({
        nice: "",
      },this.searchClick);
    }
  }
  genderChanged = (e) => {
    console.log("gender:", e.target.value);
    this.setState({
      gender: e.target.value
    },this.searchClick)
  };
  onGenderClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.gender === tag.value) {
      this.setState({
        gender: "",
      },this.searchClick);
    }
  }
  ageChanged = (e) => {
    console.log("age:", e.target.value);
    this.setState({
      age: e.target.value
    },this.searchClick)
  };
  onAgeClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.age === tag.value) {
      this.setState({
        age: "",
      },this.searchClick);
    }
  }
  maskChanged = (e) => {
    console.log("mask:", e.target.value);
    this.setState({
      mask: e.target.value
    },this.searchClick)
  };
  onMaskClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.mask === tag.value) {
      this.setState({
        mask: "",
      },this.searchClick);
    }
  }
  faceQualityChanged = (e) => {
    console.log("faceQuality:", e.target.value);
    this.setState({
      faceQuality: e.target.value
    },this.searchClick)
  };
  onFaceQualityClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.faceQuality === tag.value) {
      this.setState({
        faceQuality: "",
      },this.searchClick);
    }
  }
  glassChanged = (e) => {
    console.log("glass:", e.target.value);
    this.setState({
      glass: e.target.value
    },this.searchClick)
  };
  onGlassClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.glass === tag.value) {
      this.setState({
        glass: "",
      },this.searchClick);
    }
  }
  channelIdChanged = (e) => {
    console.log("channelId:", e.target.value);
    this.setState({
      channelId: e.target.value
    },this.searchClick)
  };
  onChannelIdClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.channelId === tag.value) {
      this.setState({
        channelId: "",
      },this.searchClick);
    }
  }
  sceneChanged = (e) => {
    console.log("scene:", e.target.value);
    this.setState({
      scene: e.target.value
    },this.sceneSearch)
  };
  onSceneClick = (e) => {
    const tag = e.target;
    if (tag.type === 'radio' && this.state.scene === tag.value) {
      this.setState({
        scene: "",
      }, this.searchClick);
    }
  }

    actionChanged = (e) => {
      console.log("action:", e.target.value);
      this.setState({
        action: e.target.value
      },this.actionSearch)
    };
    onActionClick = (e) => {
      const tag = e.target;
      if (tag.type === 'radio' && this.state.action === tag.value) {
        this.setState({
          action: "",
        },this.searchClick);
      }
    }
  onPageChange = (pageNo, pageSize) => {
    console.log(pageNo, pageSize);
    this.setState({
      pageNo:pageNo
    },this.search(pageNo));
  };

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState({
      pageSize: pageSize
    },() => this.onPageChange(current, pageSize));
  };



  render(){
    console.log("props:", this.props);
    const { result = {"pageNo":1,"pageSize":20,"total":0,"detail":[]}} = this.props;
    const { TextArea } = Input;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const RadioGroup = Radio.Group;

    return (
      <div>
        <Col span={24} style={{paddingRight:"4px"}}>
          <div>

              <div>
                <Input.Group compact>
                  <Input style={{ width: 200,left:"3%" }}
                         placeholder="请输入明星姓名或ID"
                         value={this.state.starName}
                         onChange={e => this.starNameChanged(e)}
                         onPressEnter={() => this.searchClick(1)}
                         prefix={!!this.state.starId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                  />
                  <Input disabled={true} style={{ width: 200,left:"3%"}} value={this.state.starId}/>

                  <Input style={{ width: 200, left:"5%"}}
                         placeholder="请输入专辑名或ID"
                         value={this.state.albumName}
                         onChange={e => this.albumNameChanged(e)}
                         onPressEnter={() => this.searchClick(1)}
                         prefix={!!this.state.albumId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                  />
                  <Input disabled={true} style={{ width: 200, left:"5%" }} value={this.state.albumId}/>

                  <Input style={{ width: 200,left:"7%" }}
                         placeholder="请输入剧集名或ID"
                         value={this.state.videoName}
                         onChange={e => this.videoNameChanged(e)}
                         onPressEnter={() => this.searchClick(1)}
                         prefix={!!this.state.videoId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                  />
                  <Input disabled={true} style={{ width: 200,left:"7%" }} value={this.state.videoId}/>

                  <Button type={"primary"} style={{width:60,left:"7%"}} icon={"search"} onClick={() => this.searchClick(1) } loading={this.state.loading}/>

                </Input.Group>



           </div>
          <div style={{clear:"both"}}/>
          {/*<Search*/}
          {/*placeholder="请输入关键字"*/}
          {/*size={"large"}*/}
          {/*onSearch={value => this.searchClick(value,1)}*/}
          {/*enterButton*/}
          {/*/>*/}

    <Collapse bordered={false} defaultActiveKey={['1']}>
     <Panel header="人物信息" style={{background:"#f0f2f5"}} key="1">
     <div style={{width:"100%",height:"40px", padding:"10px",textAlign:"left",top:"20px", fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onEmotionClick}>
        <label><b>表情: </b></label>
           <Radio.Group size="small" buttonStyle="solid" onChange={e=> this.emotionChanged(e)} value={this.state.emotion} >
              {Object.getOwnPropertyNames(emotion).map((k)=>
              <Radio.Button value={k} style={{marginLeft:"10px"}} >{emotion[k]}</Radio.Button>
               )}
           </Radio.Group>
     </div>

      <div style={{width:"100%",height:"40px", padding:"10px",textAlign:"left",top:"20px", fontSize:"15px",backgroundColor:"light-grey"}}  onClick={this.onFaceAngleClick}>
          <label><b>角度: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.faceAngleChanged(e)} value={this.state.faceAngle}>
            {Object.getOwnPropertyNames(faceAngle).map((k)=>
               <Radio.Button value={k} style={{marginLeft:"10px"}} >{faceAngle[k]}</Radio.Button>
            )}
          </RadioGroup>
       </div>
       <div style={{width:"100%",height:"40px", padding:"10px",top:"10px",textAlign:"left",fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onNiceClick}>
          <label><b>颜值: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.niceChanged(e)} value={this.state.nice}>
            {Object.getOwnPropertyNames(nice).map((k)=>
               <Radio.Button value={k} style={{marginLeft:"10px"}} >{nice[k]}</Radio.Button>
             )}
          </RadioGroup>
       </div>
      <div style={{width:"100%",height:"40px", padding:"10px",top:"10px",textAlign:"left",fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onGenderClick}>
          <label><b>性别: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.genderChanged(e)} value={this.state.gender}>
           {Object.getOwnPropertyNames(gender).map((k)=>
           <Radio.Button value={k} style={{marginLeft:"10px"}} >{gender[k]}</Radio.Button>
           )}
          </RadioGroup>
      </div>
      <div style={{width:"100%",height:"40px", padding:"10px",top:"10px",textAlign:"left",fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onGlassClick}>
          <label><b>配镜: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.glassChanged(e)} value={this.state.glass}>
            {Object.getOwnPropertyNames(glass).map((k)=>
             <Radio.Button value={k} style={{marginLeft:"10px"}} >{glass[k]}</Radio.Button>
            )}
          </RadioGroup>
      </div>
      <div style={{width:"100%",height:"40px", padding:"10px",top:"10px",textAlign:"left",fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onChannelIdClick}>
        <label><b>频道: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.channelIdChanged(e)} value={this.state.channelId}>
            {Object.getOwnPropertyNames(channelId).map((k)=>
            <Radio.Button value={k} style={{marginLeft:"10px"}} >{channelId[k]}</Radio.Button>
            )}
          </RadioGroup>
      </div>
      <div style={{width:"100%",height:"40px", padding:"10px",top:"10px",textAlign:"left",fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onMaskClick}>
          <label><b>口罩: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.maskChanged(e)} value={this.state.mask}>
            {Object.getOwnPropertyNames(mask).map((k)=>
            <Radio.Button value={k} style={{marginLeft:"10px"}} >{mask[k]}</Radio.Button>
            )}
          </RadioGroup>
      </div>
      <div style={{width:"100%",height:"40px", padding:"10px",top:"10px",textAlign:"left",fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onFaceQualityClick}>
          <label><b>人脸质量: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.faceQualityChanged(e)} value={this.state.faceQuality}>
            {Object.getOwnPropertyNames(faceQuality).map((k)=>
            <Radio.Button value={k} style={{marginLeft:"10px"}} >{faceQuality[k]}</Radio.Button>
            )}
          </RadioGroup>
      </div>
      <div style={{width:"100%",height:"40px", padding:"10px",top:"10px",textAlign:"left",fontSize:"15px",backgroundColor:"light-grey"}} onClick={this.onAgeClick}>
          <label><b>年龄: </b></label>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.ageChanged(e)} value={this.state.age}>
             {Object.getOwnPropertyNames(age).map((k)=>
             <Radio.Button value={k} style={{marginLeft:"10px"}} >{age[k]}</Radio.Button>
             )}
          </RadioGroup>
      </div>
      </Panel>
     </Collapse>
      <div>
      <Collapse bordered={false}>
        <Panel header="场景信息" style={{background:"#f0f2f5"}} Key="2">
         <div onClick={this.onSceneClick}>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.sceneChanged(e)} value={this.state.scene}>
            {Object.getOwnPropertyNames(scene).map((k)=>
            <Radio.Button value={k} style={{marginLeft:"6px",marginRight:"6px",marginTop:"5px"}} >{scene[k]}</Radio.Button>
            )}
          </RadioGroup>
         </div>
        </Panel>
        <Panel header="行为信息" style={{background:"#f0f2f5"}} Key="3">
         <div onClick={this.onActionClick}>
          <RadioGroup size="small" buttonStyle="solid" onChange={e => this.actionChanged(e)} value={this.state.action}>
            {Object.getOwnPropertyNames(action).map((k)=>
            <Radio.Button value={k} style={{marginLeft:"6px",marginRight:"6px",marginTop:"5px"}} >{action[k]}</Radio.Button>
            )}
          </RadioGroup>
         </div>
        </Panel>
      </Collapse>
     </div>
  </div>
          <div style={{float:"left",width:"100%"}}>
            <div style={{clear:"both"}}/>

             <div style={{align:"right",position:"relative",height:"30px",marginTop: 30}}>
                  <Input.Group compact>
                   <Col span={18}>
                        <Pagination hideOnSinglePage={true} showSizeChanger onShowSizeChange={this.onShowSizeChange}
                          onChange={this.onPageChange} pageSizeOptions={["20","50","100"]} current={this.state.pageNo}
                          style={{position:"absolute",left:"40%"}} pageSize={this.state.pageSize}
                          defaultPageSize={result.pageSize} defaultCurrent={result.pageNo} total={result.total} />
                   </Col>
                   <Col span={2}>
                        <Checkbox
                         defaultChecked={false}
                         onChange={(e)=>{this.onCheckAllChange(e)}}
                         checked={this.state.checked}
                        >
                        全选
                        </Checkbox>
                   </Col>
                   <Col span={2}>
                   <Button  shape="circle" icon="download"  onClick={this.openDownload}/>
                    <a id='a_id'></a>
                   </Col>
                  </Input.Group>
          </div>
          <div style={{width:"100%", padding:"24px", backgroundColor:"#d2d2d2", display:result["detail"].length === 0 ?"block":"none",textAlign:"center"}}>
              没有数据
            </div>
            <div style={{margin:"10px 100px",}}>
            {result["detail"].map(v =>
              <div style={{float:"left",border:"1px solid #d3d3d3",margin:"2px",backgroundColor:"#e6e6e6"}}>
                 <div style={{float:"right"}}>

                  <Checkbox
                   defaultChecked={false}
                   onChange={()=>{this.onCheckboxChange(v)}}
                   checked={this.state.segmentSet.has(v.videoId + "_" + v.startTime + "_" + v.endTime)}
                   >
                  </Checkbox>
                 </div>
                <div>
                  <a
                    style={{ position:"relative",align:"center", width: 280, height: 158, margin: '8px',float:"left" ,border:"solid 1px #c3c3c3",backgroundColor:"#e3e3e3"}}
                    onClick={()=>{window.open("player.html?qipuId=" + v.videoId + "&startSec=" + v.startTime + "&endSec=" + v.endTime,"_blank")}}
                    key={v.videoId + v.startTime}
                  >
                    <div style={{position:"static",top:"0px",left:"0px"}}>
                      <div style={{position:"absolute",top:"50px",left:"110px",
                        display:"block",opacity: 0.8,zIndex:9
                      }}>
                        <Icon type={"play-circle"} style={{fontSize:"4em"}}/>
                      </div>
                      <LazyLoad>
                        <img alt="no image" src={v.picUrl||"http://bestanimations.com/Science/Gears/loadinggears/loading-gears-animation-10.gif"}
                             style={{maxWidth: "100%", maxHeight: "100%",position:"absolute"}}/>
                      </LazyLoad>
                      <div style={{fontSize:"1.1em",position:"absolute",left:"4px",bottom:"4px",}}>
                        <span style={{marginLeft:"4px",backgroundColor:"#3a3a3a",color:'rgba(0,213,0,.85)',opacity:0.8}}>
                          {utils.timeFormat(v.startTime)}~{utils.timeFormat(v.endTime)}
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
                <div style={{padding:"6px"}}>
                  <Col span={20}>
                    <Tooltip placement={"top"} title={v.starName || v.starId}>
                      <Tag><Icon type={"user"}/>{utils.cropStringByLength(((v.actorName || v.actorId) + ""), 10)}</Tag>
                    </Tooltip>
                    <Tooltip placement={"top"} title={v.videoName || v.videoId}>
                      <Tag>{utils.cropStringByLength(((v.videoName || v.videoId) + ""), 16)}</Tag>
                    </Tooltip>
                  </Col>
              <Col span={4}>
                 <Switch checkedChildren={<Icon type="check" />}
                 unCheckedChildren={<Icon type="close" />}
                 size={"small"}
                 onChange={(e)=>this.onVideoCheck(e, v.id, v.starId, v.albumId, v.qipuId, v.startSec, v.endSec, v.picUrl, v.starName, v.albumName, v.videoName)}
                 checked={!!this.state.checked[v.id]}
              />
              </Col>
                  <div style={{clear:"both"}}/>
                </div>
              </div>
            )}
            <div style={{clear:"both"}}/>
            </div>
            <div style={{align:"right",position:"relative",height:"30px"}}>
              <Pagination hideOnSinglePage={true} showSizeChanger onShowSizeChange={this.onShowSizeChange}
                          onChange={this.onPageChange} pageSizeOptions={["20","50","100"]} current={this.state.pageNo}
                          pageSize={result.pageSize}
                          style={{textAlign:"center"}}
                          defaultPageSize={20} defaultCurrent={1} total={result.total} />
            </div>
          </div>
        </Col>
        <div>
          <BackTop/>
        </div>
      </div>
    );
  }
}



function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  console.log("mapStateToProps search result:{}", state.search.result);
  let result;
  if (state.search.result === undefined || state.search.result["total"] === undefined){
    result = {"pageNo":1,"pageSize":20,"totalNo":0,"detail":[]};
  } else {
    result = state.search.result;
  }
  return {
    result: result,
  };
}

export default  connect(mapStateToProps)(SearchPage)
