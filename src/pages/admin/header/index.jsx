import React,{Component} from 'react'
import {connect} from 'react-redux' //[1]
import './header.less'
import {formateDate} from '../../../utils/dateUtils.js' //时间格式化工具
import memoryUtils from '../../../utils/memoryUtils' //内存中存取用户信息工具 默认导出，不用加花括号
import storageUtils from '../../../utils/storageUtils' //删除localstorage中的用户登录数据
import {reqWeather} from '../../../api/index' //引入接口函数，非默认导出，加花括号

import {withRouter} from 'react-router-dom' //用于包装当前组件，使其具体路由的3属性history
import menuList from '../../../config/menuConfig.js' //导入导航配置菜单 

import {Modal} from 'antd'
import LinkButton from '../../../components/link-button/index'

class Header extends Component{

    state={
        curentTime:formateDate(Date.now()), //当前时间格式化后的字符串
        dayPictureUrl:'', //天气小图标地址
        weather:'', //天气文字
    }

    // 获取路径
    // getPath=()=>{

    // }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
          if (item.key===path) { // 如果当前item对象的key与path一样,item的title就是需要显示的title
            title = item.title
          } else if (item.children) {
            // 在所有子item中查找匹配的
            const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
            // 如果有值才说明有匹配的
            if(cItem) {
              // 取出它的title
              title = cItem.title
            }
          }
        })
        return title
      }

    //异步获取天气
    getWeather = async () => {
        //解构天气小图标，天气
        const {dayPictureUrl, weather} = await reqWeather('徐州')
        //更新状态
        this.setState({dayPictureUrl, weather})
        
        
    }

    // 每过一秒获取一次系统时间
    getTime=()=>{
        //定时器函数setInterval()
        this.intervalId = setInterval(()=>{
            let curentTime=formateDate(Date.now()) //获取当前时间并格式化为字符串
            this.setState({curentTime})
        },1000)
    }

    //退出登录
    loginOut=()=>{
        Modal.confirm({
            title: '确定要退出登录吗?',
            content: '是请点确定，否则点取消',
            onOk:()=> {//改成前头函数，因为下面要用到this.props.history.replace()
              console.log('OK');
              //删除localstorage中登录信息。及内存中登录信息
              storageUtils.removeUser()
              memoryUtils.user={}
              //跳转到登录页面,用替换因为无需退回
              this.props.history.replace('/login')
             }//,取消时什么也不做，所以可省略不写
            // onCancel() {
            //   console.log('Cancel');
            // },
          })
        
    }

//在第一次render()之后执行一次
   //一般在此执行异步操作: 发ajax请求启动定时器
    componentDidMount(){
        this.getTime();
        this.getWeather();
    }

/*
  当前组件卸载之前调用清除定时器，避免其造成警告信息
   */
  componentWillUnmount () {
    // 清除定时器
    clearInterval(this.intervalId)
  }


    render(){
        //解构state内的数据
        const {curentTime,dayPictureUrl,weather} = this.state
        //获取用户名
        const username = memoryUtils.user.username

        // 得到当前需要显示的title
        //const title = this.getTitle() 去除原来代码
        //[3]新读headtitle方式
        const title = this.props.headTitle

        return(
            <div className='header'>

                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    {/* href='javascript:' */}
                    <LinkButton  onClick={this.loginOut}>退出</LinkButton>
                </div>

                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>

                    <div className='header-bottom-right'>
                        <span>{curentTime}</span>
                        <img src={dayPictureUrl} alt='天气'/>
                        <span>{weather}</span>
                    </div>
                </div>

            </div>
        )
    }
}

//[2]把headTitle传给header组件
export default connect(
  state =>({headTitle:state.headTitle}),
  {}
)(withRouter(Header))