//* reducer函数模块: 根据当前state和指定action返回一个新的state
import {INCREMENT, DECREMENT} from './action-types'

// 管理count状态数据的reducer
export default function count(state=1,action){ //state=1初始化state的值，
    console.log('count()的state和action分别是：',state,action)  //看看都是些啥
    switch(action.type){
        case INCREMENT :
            return state + action.data //data取决于action.js里的返回对象
        case DECREMENT:
            return state - action.data 
        default:        //都不是就默认就返回state
            return state
    }
}