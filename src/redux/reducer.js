/*根据老的state和指定的action生成并返回新的state的函数*/

import {combineReducers} from 'redux' //用于合并多个reducer为一个，没有多个reducer则直接导出对应函数即可
import storageUtils from '../utils/storageUtils.js'
import {SET_HEAD_TITLE} from './action-type.js'

//用来控制头部显示标题的状态
const initHeadTitle='首页'
function headTitle(state=initHeadTitle,action){
    switch(action.type){
        //[1]添加据action返回不同数据
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}

//用来管理登录用户的reducer函数
const initUser=storageUtils.getUser() //从从localSorage读取user
function user(state=initUser,action){
    switch(action.type){
        default:
            return state
    }
}


/*导出多个reducer函数
向外默认暴露的是合并产生的总的reducer函数
管理的总的state的结构:
  {
    headTitle: '首页',
    user: {}
  }
 */
export default combineReducers({
    headTitle,
    user
})