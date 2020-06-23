import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'//[1]
import store from './redux/store.js'//[2]
import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

// 读取local中保存user, 保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user
//[3]
ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
),document.getElementById('root'))