import React, { Component } from 'react';
import { connect } from 'dva';
// import Link from 'umi/link';
import { Card, Icon, message } from 'antd';

class SearchResultPage extends Component {
  componentDidMount() {
    this.queryList();
  }

  queryList = () => {
    this.props.dispatch({
      type: 'search/queryList',
    });
  };

  deleteOne = (id) => {
    this.props.dispatch({
      type: 'search/deleteOne',
      payload: id,
    }).then(() => {
      message.success('delete success, refresh');
      this.queryList();
    });
  };

  render() {
    const { resultList = [] } = this.props;
    console.log('page: resultList');
    console.log(resultList);

    return (
      <div style={{float:"left"}}>
        {resultList.map(v => <Card
          key={v.id}
          title={v.name}
          style={{ width: 300, marginBottom: '16px',float:"left" }}
          extra={<Icon type={'delete'} onClick={() => this.deleteOne(v.id)} />}
        >{v.desc}</Card>)}
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

export default connect(mapStateToProps)(SearchResultPage);

// TODO replace antd Card with own Card.
