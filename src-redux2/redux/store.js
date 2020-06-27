// redux最核心的管理对象: store，
import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer' //导入reducer
import thunk from 'redux-thunk' // 用来实现redux异步的redux中间件插件
import {composeWithDevTools} from 'redux-devtools-extension' //【1】引入工具


export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk))) // 【2】再包一层composeWithDevTools()；创建store对象内部会第一次调用reducer()得到初始状态值