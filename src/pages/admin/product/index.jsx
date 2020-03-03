import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import Home from './home'
import AddUpdate from './add-update'
import Detail from './detail'

export default class Product extends Component{
    render(){
        return(
            <Switch>
                {/* 为防止不能匹配到product/xxx，加上exact */}
                <Route exact path='/product' component={Home} />
                <Route path='/product/add-update' component={AddUpdate} />
                <Route path='/product/detail' component={Detail} />
                {/* 如果以上都不匹配则跳转到产品首页 */}
                <Redirect to='/product' />
            </Switch>
        )
    }
}