import React, { Component } from 'react';
import { connect } from 'dva';

import { Table } from 'antd';

class TaskListPage extends Component {
  state = {
    filter:""
  };
  componentDidMount() {
    console.log("componentDidMount");
    this.props.dispatch({
      type: 'taskList/list',
      payload: ""
    });
  }
  render() {
    const columns = [
      { title: '任务ID', dataIndex: 'taskid', key: 'taskid', sorter: (a, b) => a.taskid > b.taskid},
      { title: '开始时间', dataIndex: 'beginTime', key: 'beginTime', sorter: (a, b) => a.beginTime > b.beginTime },
      { title: '结束时间', dataIndex: 'endTime', key: 'endTime', sorter: (a, b) => a.endTime > b.endTime },
      { title: '状态', dataIndex: 'status', key: 'status', sorter: (a, b) => a.status > b.status },
      { title: '消息', dataIndex: 'error_msg', key: 'error_msg' },
    ];



    const { result } = this.props;
    return (
      <div style={{backgroundColor:"#fdfdfd"}}>
        <Table bordered={true} rowKey={r => r.taskid} dataSource={result.collections} columns={columns}/>
      </div>
        );
  }
}

function mapStateToProps(state) {
  console.log('state');
  console.log(state);
  console.log("mapStateToProps taskList result:{}", state.taskList.result);
  let result;
  if (state.taskList.result === undefined || state.taskList.result["totalNo"] === undefined){
    result ={collections:[]};
  } else {
    result = state.taskList.result;
  }
  return {
    result: result,
  };
}

export default  connect(mapStateToProps)(TaskListPage)
