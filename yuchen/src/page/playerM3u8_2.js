import React, { Component } from 'react';
import queryString from 'query-string'
import { connect } from 'dva';
import videojs from 'video.js';
import offset from 'videojs-offset';
import 'video.js/dist/video-js.css'


// import fullscreen from 'videojs-landscape-fullscreen';
import request from "../util/request";

import VideoPlayer from '../component/VideoPlayer'
import {Modal} from "antd";

class PlayerM3u82Page extends Component {
  state = {
    videoOptions:{}
  };
  constructor(props){
    super(props);
    videojs.registerPlugin('offset', offset);
    const values = queryString.parse(props.location.search);
    console.log("props:" + JSON.stringify(this.props));
    this.state = { qipuId: values.qipuId, start: values.startSec, end:values.endSec};
  }

  doPlay(m3u8StartSec, m3u8EndSec){
    this.player = videojs(this.videoNode, {
      controls: true,
      plugins:{
        offset: {start: m3u8StartSec, end: m3u8EndSec, restart_beginning: false}
      },
      sources:[{
        src: `/apis/views/play?qipuid=${this.state.qipuId}&startSec=${this.state.start}&endSec=${this.state.end}&type=.m3u8`
      }],
      skin:"video-js vjs-default-skin",
      autoplay: true
    }, function onPlayerReady() {
      console.log('onPlayerReady')
    });
    this.player.play();
  }

  componentDidMount() {
    let result = request(`/apis/views/u3m8StartEnd?qipuid=${this.state.qipuId}&startSec=${this.state.start}&endSec=${this.state.end}`);
    result.then((r)=>{
      console.log("m3u8 result:", r);
      // videojs.registerPlugin('fullscreen', fullscreen);
      // this.doPlay(r.result.startSec, r.result.endSec);
      this.setState({
        videoOptions:{
          controls: true,
          plugins:{
            offset: {start: r.result.startSec, end: r.result.endSec, restart_beginning: false}
          },
          sources:[{
            src: `/apis/views/play?qipuid=${this.state.qipuId}&startSec=${this.state.start}&endSec=${this.state.end}&type=.m3u8`
          }],
          skin:"video-js vjs-default-skin",
          autoplay: true
        }
      });
    });

  }
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  render() {
    const videoJsOptions = {
      skin: 'vjs-default-skin',
      autoplay: true,
      controls: true,
      sources: [{
        src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
      }]
    };
    return (
      <Modal
        visible={true}
        style={{margin: 0, border: "none", maxHeight: "100%"}}
        bodyStyle={{backgroundColor: "#1c1c1c", marginLeft: "auto", marginRight: "auto", padding: "0px"}}
        centered={true}
        closable={false}
        footer={null}
        maskStyle={{backgroundColor: "#1c1c1c", opacity: 1}}
      >
        <VideoPlayer {...this.state.videoOptions||videoJsOptions}/>
      </Modal>
    );
  }
}

function mapStateToProps(props) {
  console.log('props');
  console.log(props);
  const values = queryString.parse(props.routing.location.search);
  return {
    video_url: values.videoUrl,
  };
}

export default  connect(mapStateToProps)(PlayerM3u82Page)
