//store:redux核心管理对象
import {createStore,applyMiddleware} from 'redux' //创建store及中间件工具
import thunk from 'redux-thunk' //异步工具
import {composeWithDevTools} from 'redux-devtools-extension' //开发者工具
import reducer from './reducer.js' //根据action处理state函数

//创建一个store
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))