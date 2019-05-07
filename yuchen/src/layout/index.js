import { Component } from 'react';
import { Layout } from 'antd';
import SiderMenu from "../component/SiderMenu/SiderMenu";
import { getMenuData } from '../common/menu';
import logo from '../assets/search.jpg';
import GlobalHeader from "../component/GlobalHeader";

const { Content, Header, Footer } = Layout;

class BasicLayout extends Component {
  componentDidMount() {
    this.setState({
      collapsed: true
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  handleMenuCollapse = () => {
    this.setState({
      // collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { children, location } = this.props;
    const { collapsed } = this.state;
    return (
      <Layout>
        <SiderMenu
          logo={logo}
          collapsed={collapsed}
          menuData={getMenuData()}
          location={location}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout style={{marginLeft: collapsed?80:100}}>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              theme={"light"}
              logo={logo}
              collapsed={collapsed}
              currentUser={{
                name: 'Super AI',
                avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                userid: '00000001',
                notifyCount: 12,
              }}
              onCollapse={this.handleMenuCollapse}
            />
          </Header>
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            { children }
          </Content>
          <Footer style={{ textAlign: 'center' }}> <span>&copy; 2018 TP·智能平台部·用户云·AI工程 </span>  <a href="mailto:aiservice@dev.qiyi.com">Email:aiservice@dev.qiyi.com</a></Footer>
        </Layout>
      </Layout>
    );
  }
}

export default BasicLayout;
