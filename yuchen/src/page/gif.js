import React, { Component } from 'react';
import { connect } from 'dva';

import {Input, Col, Button, Icon, Tabs} from 'antd';
import request from "../util/request";
const TabPane = Tabs.TabPane;
class GifPage extends Component {

  state = {
    videoId:1941119300
  };

  componentDidMount() {
  }

  process = (results) => {
    results.sort((x, y)=>{
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    }).map((result) => {
      if (result.gif_type === 1){
        result.tabTitle = "精彩片段";
      } else if (result.gif_type === 2){
        result.tabTitle = "宠物";
      } else {
        result.tabTitle = "微表情";
      }

      result.gif_info_list.map(gifInfo=>{
        gifInfo.gifUrl = "http://" + gifInfo.fileLocation.replace(/swift:.*\|/gi,"");
        gifInfo.cuts = gifInfo.cuts||[];
        gifInfo.cuts.map(cutInfo => {
          cutInfo.gifUrl = "http://" + cutInfo.fileLocation.replace(/swift:.*\|/gi,"");
          cutInfo.gifPosition = cutInfo.position.split(",").map(i=>parseInt(i));
        })
      })
    });
    console.log("results:", results);
    return results;
  };

  videoNameChanged = (e) => {
    console.log("videoName:", e.target.value);
    this.setState({
      videoName: e.target.value
    },this.getVideoIdByName)
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

  searchClick(value) {
    this.setState({
      key: value,
      loading: true
    });
    console.log("search key:" + this.state.videoId);
    this.search(value);
  }

  search(value) {
    this.props.dispatch({
      type: 'gif/search',
      payload: [this.state.videoId]
    }).then(()=>this.setState({loading:false}));
  }

  render() {
    let {result} = this.props;
    result = this.process(result);
    return (
      <div>
        <div>
          <Col span={9}>
            <Col span={23} style={{paddingRight:"8px"}}>
              <Input.Group compact>
                <Input style={{ width: '60%' }}
                       placeholder="请输入剧集名或ID"
                       value={this.state.videoName}
                       onChange={e => this.videoNameChanged(e)}
                       onPressEnter={e => this.searchClick(e,1)}
                       prefix={!!this.state.videoId ? <Icon type="check" style={{ color: 'rgba(0,213,0,.85)' }} /> : <Icon type="close" style={{ color: 'rgba(213,0,0,.85)' }} />}
                />
                <Input disabled={true} style={{ width: '40%' }} value={this.state.videoId}/>
              </Input.Group>
            </Col>
          </Col>
          <Col span={1}>
            <Button type={"primary"} icon={"search"} onClick={value => this.searchClick(value) } loading={this.state.loading}/>
          </Col>
          <div style={{clear:"both"}}/>
          <hr style={{color:"darkgray"}}/>
        </div>
        <div>
          <Tabs
            hideAdd
            onEdit={this.onEdit}
          >
            {result.map(pane => <TabPane style={{backgroundColor: "#ffffff"}} tab={pane.tabTitle} key={"tab_" + pane.gif_type} closable={false}>
              <h3>视频标题：{pane.video_title}</h3>
              {
                pane.gif_info_list.map((gif_info,i) => {
                  console.log("gif_info:", gif_info);
                  return (
                    <Col span={24}>
                      {
                        (()=>{
                          if (pane.periods_info[i] && pane.periods_info[i].start_time) {
                            return <div style={{color: "#f66", padding: 8}}>时间:{pane.periods_info[i].start_time}~{pane.periods_info[i].end_time}</div>;
                          }
                        })()
                      }
                      <Col span={18} style={{padding: 8}}>
                        <div style={{position: "relative"}}>
                          <div style={{position: "relative"}}>
                            <img style={{position: "relative",width:"100%"}} alt="gif" src={gif_info.gifUrl}/>
                          </div>
                          { (() => {
                            if (pane.periods_info[i] && pane.periods_info[i].crop) {
                              return <div style={{
                                position: "absolute",
                                left: (pane.periods_info[i].crop[0] / 10) + "%",
                                top: (pane.periods_info[i].crop[1] / 10) + "%",
                                width: (pane.periods_info[i].crop[2] - pane.periods_info[i].crop[0]) / 10 + "%",
                                height: (pane.periods_info[i].crop[3] - pane.periods_info[i].crop[1]) / 10 + "%",
                                borderColor: '#ff0000',
                                background: 'linear-gradient(to left, #f66, #f66) left top no-repeat, linear-gradient(to bottom, #f66, #f66) left top no-repeat, linear-gradient(to left, #f66, #f66) right top no-repeat, linear-gradient(to bottom, #f66, #f66) right top no-repeat, linear-gradient(to left, #f66, #f66) left bottom no-repeat, linear-gradient(to bottom, #f66, #f66) left bottom no-repeat, linear-gradient(to left, #f66, #f66) right bottom no-repeat, linear-gradient(to left, #f66, #f66) right bottom no-repeat',
                                backgroundSize: '2% 20%, 20% 2%, 2% 20%, 20% 2%'
                              }}></div>;
                            } else {
                              return "";
                            }
                          })()
                          }
                        </div>
                      </Col>
                      <Col span={6} style={{padding: 8}}>
                        <div>
                        {gif_info.cuts.map(cutInfo=>{
                          return <img alt="gif" style={{width:"100%"}} src={cutInfo.gifUrl}/>
                        })
                        }
                        </div>
                        <div>
                        {
                          (()=>{
                            if (pane.periods_info[i] && pane.periods_info[i].text) {
                              return <div style={{color: "#f66"}}>Text:{pane.periods_info[i].text}</div>;
                            }
                          })()
                        }
                        </div>
                      </Col>
                    </Col>
                    );
                })
              }
              <div style={{clear: "both"}}/>
            </TabPane>)}
          </Tabs>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  console.log("mapStateToProps collection result:{}", state.gif.result);
  let result;
  if (state.gif.result === undefined){
    result = [];
  } else {
    result = state.gif.result;
  }
  return {
    result: result,
  };
}

export default  connect(mapStateToProps)(GifPage)
