import React, { Component } from 'react';
import reqwest from 'reqwest';
import {  Select,Table,Pagination,} from 'antd';

import moment from 'moment';
class statisticsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      taskId:"",
      taskTypecode:"",
      taskTypeName:"",
      taskName:"",
      startDTime:"",
      endTime:"",
      taskStatusName:"",
      type:"",
      pageNo:1,
      pageSize:10,

    }
  }
  state = {
    data: [],
    pagination: [],
    loading: false,
  };
  downSelect =()=>{
    return(
      <Select defaultValue="任务类型" style={{ width: 120 }} onChange={this.handleChange} value={this.state.type} >
      <Option value="">任务类型</Option>
      <Option value="smartHJ">智能混剪</Option>
      </Select>
   )
  }
  handleChange = (value)=> {
    this.setState({
      type: value
    }, () => {
      this.fetch();
    });
  }

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: `/apis/collection/listTask?type=${this.state.type}&pageSize=${this.state.pageSize}&pageNo=${this.state.pageNo}`,
      method: 'get',
      type: 'json',
    }).then((data) => {
      console.log('data:',data)
      this.setState({
        loading: false,
        data: data.data,
        detail: data.data.detail,
        total:data.data.total,
      },()=>{console.log("state after fetch:",this.state)});
    });
  }
  onPageChange = (pageNo) => {
    console.log(pageNo);
    this.setState({
      pageNo:pageNo
    },this.fetch);
  };
  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    this.setState({
      pageSize: pageSize
    },() => this.onPageChange(current, pageSize));
  };
  render() {

    const columns = [
      {title: this.downSelect(), dataIndex: 'taskTypeCode',width:'10%'},
      {title: '任务类型名', dataIndex:'taskTypeName',width:'10%'},
      {title: '任务名', dataIndex:'taskName',width:'10%'},
      {title: '任务ID', dataIndex: 'taskId',width:'10%'},
      {title: '开始时间', dataIndex: 'startTime',width:'10%',render:(text) => moment(new Date(text)).format("YYYY-MM-DD hh:mm:ss")},
      {title: '结束时间', dataIndex: 'endTime',width:'10%',render:(text) => moment(new Date(text)).format("YYYY-MM-DD hh:mm:ss")},
      {title: '状态', dataIndex: 'statusName',width:'20%',render:(text,record)=><a href={ "javascript:window.open('"+ record.link+"')"}>{record.statusName}</a>},
      // {title: 'URL', dataIndex: 'link',width:'10%',},
    ];
    return(
      <div>
      <Pagination
    style={{marginRight:10,textAlign:"right"}}
    hideOnSinglePage={true}
    onChange={this.onPageChange}
    showSizeChanger
    onShowSizeChange={this.onShowSizeChange}
    defaultPageSize={10}
    pageSizeOptions={["10","50","100"]}
    defaultCurrent={1}
    pageSize={this.state.pageSize}
    current={this.state.pageNo}
    total={this.state.total}

    />
    <Table
    columns={columns}
    rowKey={record => record.taskId}
    dataSource={this.state.data&&this.state.data.detail}
    pagination={false}
    loading={this.state.loading}
    />

    <Pagination
    style={{marginRight:10,textAlign:"right"}}
    hideOnSinglePage={false}
    onChange={this.onPageChange}
    showSizeChanger
    onShowSizeChange={this.onShowSizeChange}
    defaultPageSize={10}
    pageSizeOptions={["10","50","100"]}
    defaultCurrent={1}
    pageSize={this.state.pageSize}
    current={this.state.pageNo}
    total={this.state.total}


    />

    </div>
  );
  }
}
export default  statisticsPage
