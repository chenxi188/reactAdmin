import React,{Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom' //引入路由组件
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd'; //引入antd的页面布局
import LeftNav from './left' //因为文件名是index所以可省略
import Header from './header/index' 

//引入需要配置路由的页面
import Home from './home'

import Category from './category' //产品分类
import Product from './product'

import Role from './role' //角色管理页面
import User from './user' //用户管理页面

import Bar from './charts/bar' //图表页面
import Pie from './charts/pie'
import Line from './charts/line'


const { Footer, Sider, Content } = Layout;

class Admin extends Component{
    constructor(props){
        super(props);
    }

    render(){
        // 读取memoryUtils里的user数据，如果不存在就跳转到登录页面
        const user=memoryUtils.user
        if(!user || !user._id){
            return <Redirect to='/login'/>
        }
        return(
          
            <Layout style={{minHeight:'100%'}}>
                <Sider>
                    <LeftNav/>
                </Sider>
                <Layout>
                    <Header/>
                    {/*路由配置在要显示的位置，即内容里 */}
                    <Content style={{backgroundColor:'#fff',margin:20,height:'100%'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/user' component={User}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>

                            {/*如果以上都不匹配跳转到home页 */}
                            <Redirect to='/home'/>
                        </Switch>
                        
                    </Content>
                    <Footer style={{textAlign:'center',color:'#333'}}>版权所有@pasaulis</Footer>
                </Layout>
            </Layout>
           
        )
    }
}
export default Admin
