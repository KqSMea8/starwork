import React, { Component } from 'react';
// import Link from 'umi/link';
import { connect } from 'dva';

import { Card, Icon, Input, message } from 'antd';

class SearchBarPage extends Component {
  componentDidMount() {
  }

  searchClick(value) {
    console.log("search key:" + value)
  }

  render() {
    const Search = Input.Search;

    return (
      <div>
      <Search
    placeholder="请输入关键字"
    size={"large"}
    onSearch={value => this.searchClick(value)}
    enterButton
    />
    <hr style={{color:"darkgray"}}/>
    </div>);
  }
}

function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  return {
    resultList: state.search.resultList,
  };
}

export default  connect(mapStateToProps)(SearchBarPage)

// TODO replace antd Card with own Card.
