import React, { Component } from 'react';
import { connect } from 'dva';
import * as utils from '../util/commons'

import {Input, Modal, Pagination, Icon, Tag, Tooltip, Col, Button, Drawer, notification} from 'antd';
import Player from "../assets/player.css";
import request from "../util/request";
import { push } from 'react-router-redux';
import qs from 'query-string';

class CollectionPage extends Component {

  state = {
    pageSize: 20,
    pageNo: 1,
    checked: {},
    key: "",
    videoUrl: "",
    videoType : 1,
    playerVisible: false,
    generateVisible: false,
    checkedDisplay: "",
    paginationVisible: false,
    bgmQipuId: "",
    starIdReady: false,
    starId: null,
    starName: "",
    albumIdReady: false,
    albumId: null,
    albumName: "",
    videoIdReady: false,
    videoId: undefined,
    videoName: "",
    drawerVisible: false,
    tagInputVisible: false,
    tagInputValue: "",
    tags: [],
    tagFixedSize: 0,
    publishStarName: "",
    publishAlbumName: "",
    publishTaskId: null,
    pizzaUserId: 1644236821
  };

  constructor(props) {
    super(props);
  }

  getStarIdByName = () => {
    if(this.state.starName.trim() === ""){
      this.setState({
        starId: null,
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
        albumId: null,
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
      albumName: albumName
    },this.getAlbumIdByName)
  };


  getColor = (qipuId, startSec) => {
    console.log("getColor");
    if (this.state.checked[qipuId + startSec]) {
      return "#4EEE94 #4EEE94"
    }
    return "#c3c3c3 #c3c3c3";
  };

  componentDidMount() {
    window.setTimeout( ()=>this.init(), 0);
  }

  init = () => {
    console.log("query string:", this.props.location);
    const query = this.props.location.query||{};
    let starName = query.starName||"";
    let startId = query.starId||null;
    let albumName = query.albumName||null;
    let albumId = query.albumId||null;
    let pageSize = query.pageSize||20;
    let pageNo = query.pageNo||1;
    this.setState({
      starIdReady: true,
      starId: startId,
      starName: starName,
      albumIdReady: true,
      albumId: albumId,
      albumName: albumName,
      pageSize: pageSize,
      pageNo: pageNo
    }, () => this.searchClick(pageNo));
  };

  search(pageNo) {
    console.log("search collection pageNo:", pageNo);
    this.setQueryString(pageNo);
    this.props.dispatch({
      type: 'collection/search',
      payload: [this.state.starId, this.state.albumId, this.state.pageSize, pageNo]
    }).then(()=>this.setState({loading:false}));
  }

  setQueryString = (pageNo) => {
    let conditions = {
      starId: this.state.starId,
      starName: this.state.starName,
      albumId: this.state.albumId,
      albumName: this.state.albumName,
      videoId: this.state.videoId,
      videoName: this.state.videoName,
      pageSize: this.state.pageSize,
      pageNo: pageNo
    };
    const queryString = qs.stringify(conditions);
    this.props.dispatch(push({
      search: queryString
    }));
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      playerVisible: false,
      videoUrl: ""
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      playerVisible: false,
      videoUrl: ""
    });
  };

  playVideo = (videoUrl,type) => {
    console.log(`videoUrl:${videoUrl} taskType:${type}`);
    let visible;
    if (videoUrl === undefined || videoUrl === null || videoUrl === "") {
      visible = false;
    } else {
      visible = true;
    }
    this.setState({
      playerVisible: visible,
      videoUrl: videoUrl,
      videoType: type
    })
  };

  searchClick(pageNo) {
    console.log("pageNo:" + pageNo);
    this.setState({pageNo:pageNo}, () =>this.search(pageNo));
  }

  onPageChange = (pageNo, pageSize) => {
    console.log(pageNo, pageSize);
    this.setState({pageNo: pageNo, pageSize: pageSize}, () =>this.search(pageNo));
  };

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState({
      pageSize: pageSize
    }, () => this.onPageChange(current, pageSize));
  };

  process = (result) => {
    result = utils.groupBy(result.collections,"taskType");
    console.log("result:",result);
    return result;
  };

  toPublish = (videoInfo) => {
    let starName = videoInfo.starNames.slice(0, 2).join(" ");
    let albumName = videoInfo.albumName || "";
    let tags = [];
    if(starName !== ""){
      tags = tags.concat(videoInfo.starNames.slice(0,2));
    }

    if(albumName !== ""){
      tags.push(albumName);
    }
    console.log("videoInfo:", videoInfo);
    this.setState(
      {
        drawerVisible: true,
        publishStarName: starName,
        publishAlbumName: videoInfo.albumName || "",
        tags: tags,
        publishTaskId: videoInfo.taskid
      });
  };

  showTagInput = () => {
    this.setState({ tagInputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ tagInputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const tagInputValue = state.tagInputValue;
    let tags = state.tags;
    if (tagInputValue && tags.indexOf(tagInputValue) === -1) {
      tags = [...tags, tagInputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      tagInputVisible: false,
      tagInputValue: '',
    });
  };
  handleTagClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  getPublishPayload = () => {
    return {taskId: this.state.publishTaskId, userId: this.state.pizzaUserId}
  };

  onPublishClick = () => {
    let payload = this.getPublishPayload();
    console.log("publish payload:", payload);
    if (payload) {

      this.props.dispatch({
        type: 'collection/publish',
        payload: payload
      }).then(() => {
        this.setState({drawerVisible: false});
        this.openNotification("恭喜", "集锦发布成功");
      });
    }
  };

  openNotification = (title, desc) => {
    notification.open({
      message: title,
      description: desc,
      icon: <Icon type="smile" style={{ color: '#108ee9' }} />
    });
  };

  saveInputRef = input => this.input = input;
  render() {
    const {result = {"totalNo":0,"segs":[]}} = this.props;
    const { TextArea } = Input;

    return (
      <div>
        <div>
          <Col span={15}>
            <Col span={12} style={{paddingRight:"8px"}}>
              <Input.Group compact>
                <Input style={{ width: '60%' }}
                       placeholder="请输入明星姓名或ID"
                       value={this.state.starName}
                       onChange={e => this.starNameChanged(e)}
                       onPressEnter={() => this.searchClick(1)}
                       prefix={!!this.state.starId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                />
                <Input disabled={true} style={{ width: '40%'}} value={this.state.starId}/>
              </Input.Group>
            </Col>
            <Col span={12} style={{paddingRight:"8px"}}>
              <Input.Group compact>
                <Input style={{ width: '60%' }}
                       placeholder="请输入专辑名或ID"
                       value={this.state.albumName}
                       onChange={e => this.albumNameChanged(e)}
                       onPressEnter={() => this.searchClick(1)}
                       prefix={!!this.state.albumId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                />
                <Input disabled={true} style={{ width: '40%' }} value={this.state.albumId}/>
              </Input.Group>
            </Col>
          </Col>
          <Col span={1}>
            <Button type={"primary"} icon={"search"} onClick={() => this.searchClick(1) } loading={this.state.loading}/>
          </Col>
          <div style={{clear:"both"}}/>
          <hr style={{color:"darkgray"}}/>
        </div>
        <div style={{float: "left"}}>
          <div style={{clear: "both"}}/>
          <div>
            {
              this.state.checkedDisplay
            }
          </div>
          <div style={{clear: "both"}}/>
          <div style={{align: "right", position: "relative", height: "30px"}}>
            <Pagination hideOnSinglePage={true} showSizeChanger onShowSizeChange={this.onShowSizeChange}
                        onChange={this.onPageChange} pageSizeOptions={["20", "50", "100"]} current={this.state.pageNo}
                        pageSize={this.state.pageSize}
                        style={{position: "absolute", right: "10px"}}
                        defaultPageSize={result.pageSize} defaultCurrent={this.state.pageNo} total={result.totalNo}/>
          </div>
          <div style={{float: "left"}}/>
            {result["collections"].map(v => <div key={v.taskId} style={{float:"left",border:"1px solid #d3d3d3",margin:"20px",backgroundColor:"#e6e6e6"}}>
              <a
                style={{
                  position: "relative",
                  align: "center",
                  // width: v.taskType === 2?210:374,
                  // height: v.taskType === 2?374:210,
                  width: 210,
                  height: 374,
                  float: "left",
                  border: "solid 1px #c3c3c3",
                  backgroundColor: "#e3e3e3",
                }}
                onClick={() => this.playVideo(v.swift_url, v.taskType)}
                key={v.taskId}
              >
                <div style={{position: "static", top: "0px", left: "0px"}}>
                  <div style={{
                    position: "absolute",
                    // top: v.taskType === 2?"150px":"70px", left: v.taskType === 2?"70px":"150px",
                    top: "150px", left: "70px",
                    display: v.swift_url ? "block" : "none", opacity: 0.8, zIndex: 9
                  }}>
                    <Icon type={"play-circle"} style={{fontSize: "4em"}}/>
                  </div>
                  <img alt="no image"
                       src={v.pic_swift_url || "http://bestanimations.com/Science/Gears/loadinggears/loading-gears-animation-10.gif"}
                       style={{maxWidth: "100%", maxHeight: "100%", position: "absolute"}}/>
                  <div style={{fontSize: "1.1em", position: "absolute", left: "10px", bottom: "10px",}}>
                    <span style={{marginLeft: "4px", backgroundColor: "#3a3a3a", color: "#ffffff", opacity: 0.7}}>
                      #{v.taskid}
                    </span>
                  </div>
                </div>
              </a>
              <div style={{fontSize:"1em",margin:"6px"}}>
                <div style={{fontSize:"1em",marginBottom:"2px"}}>
                  <Col span={20}>
                    {v.starNames.slice(0,1).map(starName =>
                      <Tooltip placement={"top"} title={starName}>
                        <Tag style={{fontSize:"1em"}}><Icon type={"user"}/> {utils.cropStringByLength((starName + ""), 6)}</Tag>
                      </Tooltip>
                    )}
                  </Col>
                  <Col span={4}>
                    <Tooltip placement={"right"} title={"新窗口打开"}>
                      <Button size={"small"}
                              onClick={()=>{window.open("playerByUrl.html?videoUrl=" + v.swift_url,"_blank")}}>
                        <Icon type={"enter"} style={{transform:"rotate(180deg)"}}/>
                      </Button>
                    </Tooltip>
                  </Col>
                </div>
                <div>
                  <Col span={20}>
                    <Tooltip placement={"top"} title={v.albumName || v.album_id || "未知"}>
                      <Tag style={{fontSize:"1em"}}><Icon type={"video-camera"}/> {utils.cropStringByLength(((v.albumName || v.album_id) + ""), 10)}</Tag>
                    </Tooltip>
                  </Col>
                  <Col span={4}>
                    <Tooltip placement={"right"} title={"发布到姜饼"}>
                      <Button icon={"upload"} size={"small"} type={"primary"} onClick={() => this.toPublish(v)}/>
                    </Tooltip>
                  </Col>
                </div>
              </div>
            </div>)}
          <div style={{clear: "both"}}/>
          <div style={{align: "right", position: "relative", height: "30px"}}>
            <Pagination hideOnSinglePage={true} showSizeChanger onShowSizeChange={this.onShowSizeChange}
                        onChange={this.onPageChange} pageSizeOptions={["20", "50", "100"]} current={this.state.pageNo}
                        pageSize={this.state.pageSize}
                        style={{position: "absolute", right: "10px"}}
                        defaultPageSize={this.state.pageSize} defaultCurrent={this.state.pageNo} total={result.totalNo}/>
          </div>
          <Modal
            visible={this.state.playerVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => {
              console.log("afterClose");
              this.setState({videoUrl: ""})
            }}
            style={{margin: 0, border: "none"}}
            wrapClassName={Player}
            bodyStyle={{backgroundColor: "#1c1c1c", marginLeft: "auto", marginRight: "auto", padding: "0px"}}
            width={this.state.videoType === 1 ? "60%": "25%"}
            centered={true}
            closable={true}
            footer={null}
            maskStyle={{backgroundColor: "#1c1c1c", opacity: 0.9}}
          >
            <video style={{width: "100%", height: "100%", objectFit: "fill", opacity: 1}} src={this.state.videoUrl}
                   autoPlay={true} controls={"controls"}/>
          </Modal>
          <Drawer
            visible={this.state.drawerVisible}
            placement={"bottom"}
            onClose={() => this.setState({drawerVisible:false})}
            height={400}
          >
            <div>
              <Col span={24}>
                <Col span={18}>
                  <Input placeholder="给集锦取个名字吧"
                         value={this.state.publishStarName + " " + this.state.publishAlbumName}/>
                </Col>
                <Col span={24}>
                  <Col span={4}>
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} value={this.state.pizzaUserId}
                           onChange={e => {this.setState({pizzaUserId: e.target.value});}}
                    />
                  </Col>
                </Col>
                <Col span={24}>
                  {this.state.tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                      <Tag key={tag} closable={index >= this.state.tagFixedSize} afterClose={() => this.handleTagClose(tag)}>
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </Tag>
                    );
                    return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                  })}
                  {this.state.tagInputVisible && (
                    <Input
                      ref={this.saveInputRef}
                      type="text"
                      size="small"
                      style={{ width: 78 }}
                      value={this.state.tagInputValue}
                      onChange={this.handleInputChange}
                      onBlur={this.handleInputConfirm}
                      onPressEnter={this.handleInputConfirm}
                    />
                  )}
                  {!this.state.tagInputVisible && (<Tag onClick={this.showTagInput}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                    <Icon type="plus" /> 添加标签
                  </Tag>
                  )}
                </Col>
                <Col span={24} style={{padding:"10px 0 10px 0"}}>
                  <TextArea placeholder="给集锦写个简介吧"
                            value={this.state.publishStarName + " " + this.state.publishAlbumName}
                            autosize={{ minRows: 3, maxRows: 8 }}/>
                </Col>
                <Col span={12} style={{padding:"10px 0 10px 0",align:"center"}}>
                  <Button icon={"close"} size={"large"} onClick={() => this.setState({drawerVisible:false})}
                  >取消</Button>
                </Col>
                <Col span={12} style={{padding:"10px 0 10px 0"}}>
                  <Button size={"large"} icon={"check"} type={"primary"}
                          onClick={() => this.onPublishClick()}
                  >发布</Button>
                </Col>
              </Col>
            </div>
          </Drawer>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  console.log("mapStateToProps collection result:{}", state.collection.result);
  let result;
  if (state.collection.result === undefined || state.collection.result["totalNo"] === undefined){
    result = {"collections":[]};
  } else {
    result = state.collection.result;
  }
  return {
    result: result,
  };
}

export default connect(mapStateToProps)(CollectionPage)
