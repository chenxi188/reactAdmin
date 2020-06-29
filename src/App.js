import React,{Component} from 'react'
import {HashRouter,Route,Switch} from 'react-router-dom' //【1】BrowserRouter
import Admin from './pages/admin/admin'
import Login from './pages/login/login'

class App extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
        //【2】删掉<BrowserRouter>，并改成HashRouter
        <HashRouter>
           <Switch>
               <Route path='/login' component={Login}></Route>
               <Route path='/' component={Admin}></Route>
           </Switch>
        </HashRouter>
        //</BrowserRouter> 
        )
    }
}
export default App
