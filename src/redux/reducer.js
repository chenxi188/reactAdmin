/*根据老的state和指定的action生成并返回新的state的函数*/
import {combineReducers} from 'redux' //【1】用于合并多个reducer为一个，没有多个reducer则直接导出对应函数即可
import storageUtils from '../utils/storageUtils.js' //【2】引入localStorage管理函数
import {SET_HEAD_TITLE,RECEIVE_USER,SHOW_ERROR_MSG,RESET_USER} from './action-type.js' //【3】引入action-type

//用来控制头部显示标题的状态
const initHeadTitle=''
function headTitle(state=initHeadTitle,action){
    switch(action.type){
        //添加据action返回不同数据
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

//【4】用来管理登录用户的reducer函数
const initUser=storageUtils.getUser() //从从localSorage读取user
function user(state=initUser,action){
    switch(action.type){
        case RECEIVE_USER: //如果收到的action是RECEIVE_USER则把用户数据返回
            return action.user 
        case SHOW_ERROR_MSG: //如果收到的是错误信息，则证明登录错误，就把错误信息加到原state里
            const errorMsg=action.errorMsg
            return {...state,errorMsg} // state.errorMsg = errorMsg 有人可能用这种，建议不要用这种方式直接修改原本状态数据
        case RESET_USER: //如果收到的action-Type是这个，即表示需要退出登录，把用户的state置空即可
            return {}
        default:
            return state
    }
}


/*【5】导出多个reducer函数:
向外默认暴露的是合并产生的总的reducer函数,管理的总的state的结构:
  {headTitle: '首页',user: {} } 
*/
export default combineReducers({
    headTitle,
    user
})