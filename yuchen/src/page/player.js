import React, { Component } from 'react';
import queryString from 'query-string'
import { connect } from 'dva';
import {Modal} from "antd";
import Player from "../assets/player.css";

class PlayerPage extends Component {
  state = {

  };
  componentDidMount() {

  }

  playClick(value) {
    console.log("search key:" + value);
    state.player.url = value;
  }

  render() {
    console.log("props" + JSON.stringify(this.props));
    const values = queryString.parse(this.props.location.query);
    return (
      <Modal
        visible={true}
        style={{margin: 0, border: "none", maxHeight: "100%"}}
        wrapClassName={Player}
        bodyStyle={{backgroundColor: "#1c1c1c", marginLeft: "auto", marginRight: "auto", padding: "0px"}}
        centered={true}
        closable={false}
        footer={null}
        maskStyle={{backgroundColor: "#1c1c1c", opacity: 1}}
      >
        <video style={{width: "100%",height: "100%", objectFit: "fill", opacity: 1}}
               src={this.props.location.query.videoUrl} autoPlay={true} controls={"controls"}/>
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

export default  connect(mapStateToProps)(PlayerPage)
