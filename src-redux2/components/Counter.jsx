import React,{Component} from 'react'
import PropTypes from 'prop-types' //引入propTypes
//import {increment,decrement} from './redux/actions' //【0】没用了，删除


/*
UI组件：
  主要做显示与与用户交互
  代码中没有任何redux相关的代码
 */
export default class App extends Component{
    
    //【1】接收相关参数
    static propTypes={
      count:PropTypes.number.isRequired,
      increment:PropTypes.func.isRequired, 
      decrement:PropTypes.func.isRequired, 
      incrementAsync: PropTypes.func.isRequired, //【1】接收异步
    }

    constructor(props) {
      super(props)
      this.numberRef = React.createRef() //创建一个ref
    }

    //【2】异步函数
    incrementAsync = () => {
      const number = this.numberRef.current.value * 1
      this.props.incrementAsync(number)
    }


    //自加 increment
    increment = () => {
        const number = this.numberRef.current.value * 1 //引用ref处的当前值
        // this.setState(state => ({count: state.count + number}))
        this.props.increment(number)  //【2】改为用接收到的函数处理数据 下同
    }

    //自减
    decrement = () => {
        const number = this.numberRef.current.value * 1
        this.props.decrement(number) //【3】用接收到的函数处理数据
      }
    
      //如果当前是奇数就进行自加
      incrementIfOdd = () => {
        const number = this.numberRef.current.value * 1
        if (this.props.count % 2 === 1) {
          this.props.increment(number) //【4】用接收到的函数处理数据
        }
    
      }

      //异步自加，此处用隔一秒加模拟异步
      incrementAsync = () => {
        const number = this.numberRef.current.value * 1
        setTimeout(() => {
          this.props.increment(number) //【5】用接收到的函数处理数据
        }, 1000)
      }

    render(){
        //【6】得到count的数据，来自接收到的count
        const count = this.props.count
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