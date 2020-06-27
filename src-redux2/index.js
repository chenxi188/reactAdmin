import React from 'react' 
import ReactDOM from 'react-dom'
import App from './containers/App'
import store from './redux/store' //导入store
import {Provider} from 'react-redux' //【2】引入provider

//【3】改写App；   传store给App子组件
//【4】传入不止一个对象，记得加括号；把app的store移到provider里
ReactDOM.render((
    <Provider store={store}>
      <App/>
    </Provider>
  ), document.getElementById('root'))

/*【1】去除监听，react-redux里会自动添加
//给store绑定状态更新的监听
store.subscribe(() => { // store内部的状态数据发生改变时回调
    // 重新渲染App组件标签
    ReactDOM.render(<App store={store} />, document.getElementById('root'))
})
*/