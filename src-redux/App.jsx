import React,{Component} from 'react'
import PropTypes from 'prop-types' //引入propTypes
import {increment,decrement} from './redux/actions' //引入动作

export default class App extends Component{
    /*state = { //关闭state
        count: 0
      }*/
    
    //接收store--前一步转index.js传一个store过来
    static propTypes={
        store:PropTypes.object.isRequired
    }


    constructor(props) {
      super(props)
      this.numberRef = React.createRef() //创建一个ref
    }


    //自加 increment
    increment = () => {
        const number = this.numberRef.current.value * 1 //引用ref处的当前值
        // this.setState(state => ({count: state.count + number}))
        this.props.store.dispatch(increment(number))  //改变状态也可写成这样，但正常是单独写个动作放acions.js里 dispatch({type:'INCREMENT',data:number})
    }

    //自减
    decrement = () => {
        const number = this.numberRef.current.value * 1
        this.props.store.dispatch(decrement(number))
      }
    
      //如果当前是奇数就进行自加
      incrementIfOdd = () => {
        const number = this.numberRef.current.value * 1
        if (this.props.store.getState() % 2 === 1) {
          this.props.store.dispatch(increment(number))
        }
    
      }

      //异步自加，此处用隔一秒加模拟异步
      incrementAsync = () => {
        const number = this.numberRef.current.value * 1
        setTimeout(() => {
          this.props.store.dispatch(increment(number))
        }, 1000)
      }

    render(){
        //得到store的状态，此时应该显示1
        const count = this.props.store.getState()
        return(
            <div>
                <p>click {count} times</p>
                <select ref={this.numberRef}> {/**使用ref */}
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select> &nbsp;&nbsp;
                <button onClick={this.increment}>+</button>&nbsp;&nbsp;
                <button onClick={this.decrement}>-</button>&nbsp;&nbsp;
                <button onClick={this.incrementIfOdd}>increment if odd</button>&nbsp;&nbsp;
                <button onClick={this.incrementAsync}>increment async</button>
            </div>
        )
    }
}