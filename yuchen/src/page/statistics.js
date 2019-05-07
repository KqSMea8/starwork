import React, { Component } from 'react';

import reqwest from 'reqwest';
import { Input, Select,Table,Col,Row,DatePicker,Button,Pagination,} from 'antd';
import moment from 'moment';
const {RangePicker} = DatePicker;

const columns = [
  {title: '描述', dataIndex: 'desc',width:'20%',render:(text,record)=><a href={ "javascript:window.open('"+ record.link+"')"}>{record.desc}</a>,},
  {title: '播放数', dataIndex:'playCnt',defaultSortOrder: 'descend',sorter:(a,b)=>a.playCnt - b.playCnt, width:'5%',align:'right',},
  {title: '账号', dataIndex: 'account',width:'10%', render:(text, record) => accountIdAndName[text]||text},
  {title: 'fileid', dataIndex: 'fileId',width:'10%',},
  {title: 'feedid', dataIndex: 'feedId',width:'10%',},
  // {title: 'URL', dataIndex: 'link',width:'10%',},
  {title: '曝光率', dataIndex: '',width:'5%',align:'right'},
  {title: '点赞数', dataIndex: 'likeCnt',width:'5%',align:'right'},
  {title: '评论数', dataIndex: 'commentCnt',width:'5%',align:'right'},
  {title: '上传时间', dataIndex: 'uploadTime',width:'10%',render:(text, record) => moment(new Date(text)).format("YYYY-MM-DD hh:mm:ss")},
];

const channelIdAndName = {1: "姜饼"};
const accountIdAndName = {1: "星艺工厂", 2: "星艺极限", 3: "星艺搞笑"};
class statisticsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      channel: "",
      account: "",
      startDate:null,
      endDate:null,
      pageNo:1,
      pageSize:10,
      likeTotal:"",
      commentTotal:"",
      playTotal:"",
    }
  }
  state = {
    data: [],
    pagination: [],
    loading: false,
  };
  onChannelChanged = (value) => {
    console.log("channel:", value);
    this.setState({
      channel: value
    });
  };
  onAccountChanged = (value) => {
    console.log("account:", value);
    this.setState({
      account: value
    });
  };

  onSearchClick() {
    this.fetch();
  }


  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: `/apis/statistics/vv/total?channel1Id=${this.state.channel}&accountId=${this.state.account}&startDate=${this.state.startDate||""}&endDate=${this.state.endDate||""}&pageSize=${this.state.pageSize}&pageNo=${this.state.pageNo}`,
      method: 'get',
      type: 'json',
    }).then((data) => {
      // Read total count from server
      console.log('data:',data)
      this.setState({
        loading: false,
        data: data.data,
        total: data.data.total
      },()=>{console.log("state after fetch:",this.state)});
    });
  }
  Wopen=()=>{
    window.open(`/apis/statistics/vv/total/download?channelId=${this.state.channel}&accountId=${this.state.account}&startDate=${this.state.startDate||""}&endDate=${this.state.endDate||""}`)
  }
  onOK=(value)=>{
    console.log('onOK: ', value);
  }
 onDateChange=(value)=> {
   console.log("date value", value);
   if (value == null) {
     this.setState({
       startDate: null,
       endDate: null
     })
   } else {
     this.setState({
       startDate: (value[0]&&value[0].format("YYYYMMDD"))||"",
       endDate: (value[1]&&value[1].format("YYYYMMDD"))||""
     })
   }
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
    return(
      <div>
      <Row>
      <Col span={18}>
      <Col span={6}>
      <Input.Group compact>
    < b style = {{fontSize:"16px"}}>渠道：</b>
    < Select
    defaultValue="姜饼"
    style={{ width: 200, top:-5}}
    placeholder = "请输入渠道"
    value={this.state.channel}
    onChange = {e=>this.onChannelChanged(e)}
    >
      <Option value="1" >姜饼</Option>
      </Select>
    </Input.Group>
    </Col>
    <Col span={6}>
      <Input.Group compact>
    <b style = {{fontSize:"16px"}}>账号：</b>
    <Select
    style={{ width: 200, top:-5}}
    placeholder = "请输入账号"
    value={this.state.account}
    onChange = {e=>this.onAccountChanged(e)}
    >
      <Option value="">&nbsp;</Option>
      <Option value="1">星艺工厂</Option>
      <Option value="2" >星艺极限</Option>
      <Option value="3" >星艺搞笑</Option>
      </Select>
    </Input.Group>
    </Col>
    <Col span={10}>
      <Input.Group compact>
    <b style={{fontSize:"16px"}}>视频选择上传日期：</b>
    <RangePicker
    style={{ width: 200,top:-5 }}
    format="YYYYMMDD"
    defaultValue={[this.state.startDate,this.state.endDate]}
    placeholder={['StartDate','endDate']}
    onChange={e=>this.onDateChange(e)}
    onOK={e=>this.onOK(e)}
    />
    </Input.Group>
    </Col>
    <Col span={1}>
      <Button type="primary" style={{top:-7}} onClick={e=> {this.onSearchClick(e)}}>Search</Button>
    </Col>
    </Col>
    <Col span={5}>
      <Button style={{top:-7}} onClick={e=>{this.Wopen(e)}}>输出数据</Button>
    </Col>
    </Row>
    <hr style={{color:"darkgray"}}/>
      <div>
    <table border="1px" bordercolor="lightgray" width="600"  cellspacing="10" textalign="center">

      <tr height="50">
      <th rowspan="2">总量数据</th>
      <th>播放数</th>
      <th>点赞数</th>
      <th>评论数</th>

      </tr>
      <tr height="60">
      <td> {this.state.data&&this.state.data.playTotal} </td>
      <td> {this.state.data&&this.state.data.likeTotal} </td>
      <td> {this.state.data&&this.state.data.commentTotal} </td>
      </tr>
    </table>
    </div>

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
    rowKey={record => record.feedId}
    dataSource={this.state.data&&this.state.data.detail}
    pagination={false}
    loading={this.state.loading}
    />
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
    </div>
  );
  }
}
export default  statisticsPage
