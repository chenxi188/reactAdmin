import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-type.js'
import {reqLogin} from '../api/index.js'
import storageUtils from '../utils/storageUtils.js'

//头部标题action
export const setHeadTitle=(headTitle)=>({type:SET_HEAD_TITLE,data:headTitle})
//用户管理action，把请求后返回的用户信息，做为参数返回
export const receiveUser=(user)=>({type:RECEIVE_USER,user})
//显示错误信息同步action
export const showErrorMsg=(errorMsg)=>({type:SHOW_ERROR_MSG,errorMsg})

//异步登录action
export const login=(username,password)=>{
    //整体通过dispatch推到reducer
    return async dispatch => {
        //1.进行异步登录请求，把返回的结果保存到result里
        const result=await reqLogin(username,password)
        //2.如果返回的结果.status为0证明登录成功
        if(result.status===0){
            //把收到结果的data数据保存到user里
            const user=result.data
            //把数据保存到storage里
            storageUtils.saveUser(user)
            //把user数据推到reducer里 
            dispatch(receiveUser(user))
        } else {
            //3.否则就是登录失败
            //把返回的错误信息保存到user里
            const msg=result.msg
            //把返回的错误信息推送到reducer
            dispatch(showErrorMsg(msg))
        }


    }
}


/*
退出登陆的同步action
 */
export const logout = () =>  {
    // 删除local中的user
    storageUtils.removeUser()
    // 返回action对象
    return {type: RESET_USER}
  }