// redux最核心的管理对象: store，
import {createStore} from 'redux'
import reducer from './reducer' //【1】导入reducer


export default createStore(reducer) // 【2】创建store对象内部会第一次调用reducer()得到初始状态值