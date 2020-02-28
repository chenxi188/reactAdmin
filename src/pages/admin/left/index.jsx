import React,{Component} from 'react'
import {Link,withRouter} from 'react-router-dom' //【1】withRouter：高阶函数，用于把非路由组件包装成路由组件
import './left.less'
import logo from '../../../assets/images/logo.png'
import { Menu, Icon } from 'antd';
import menuList from '../../../config/menuConfig.js'


const { SubMenu } = Menu;

class LeftNav extends Component{

    state = {
        collapsed: false,
      };
      
    //   控制左侧导航收缩
      toggleCollapsed = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      };

    // 根据配置文件自动写入左侧导航到页面
    getMenuItem=(menuList)=>{
        // 【1】得到当前请求的路由路径
        const path = this.props.location.pathname

        return menuList.map(item=>{
            if(!item.children){
                return(
                <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
                )
            }else{
                // 【2】查找一个与当前请求路径匹配的子Item
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                // 如果存在, 说明当前item的子列表需要打开
                if (cItem) {
                    this.openKey = item.key
                }

                return(
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                            </span>
                        }
                        >
                        {this.getMenuItem(item.children)}
                        
                    </SubMenu>
                )
            }
        })
    }
    /*
    【3】在第一次render()之前执行一次
    为第一个render()准备数据(必须同步的)
    */
    componentWillMount () {
        this.menuNodes = this.getMenuItem(menuList)
    }

    render(){
        // 得到当前请求的路由路径
        let path=this.props.location.pathname
        // 【4】得到需要打开菜单项的key
        const openKey = this.openKey

        return (
        <div className='left'>
            <Link to='/home' className='left-header'>
                <img src={logo} alt='logo' />
                <h1>深蓝管理后台</h1>
            </Link>
            
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]} 
          mode="inline"
          theme="dark"
          
         >{/*inlineCollapsed={this.state.collapsed}*/}
            {this.menuNodes}
          
        </Menu>
        </div>
        ) 
    }
}

/*用withRouter高阶组件:
包装非路由组件, 返回一个新的组件
新的组件向非路由组件传递3个属性: history/location/match
 */
export default withRouter(LeftNav) 