import React,{Component} from 'react'

export default class App extends Component{
    state = {
        count: 0
      }


    constructor(props) {
    super(props)
    this.numberRef = React.createRef() //【1】创建一个ref
    }


    //自加
    increment = () => {
        const number = this.numberRef.current.value * 1 //【3】引用ref处的当前值
        this.setState(state => ({count: state.count + number}))
    }

    //自减
    decrement = () => {
        const number = this.numberRef.current.value * 1
        this.setState(state => ({count: state.count - number}))
      }
    
      //如果当前是奇数就进行自加
      incrementIfOdd = () => {
        const number = this.numberRef.current.value * 1
        if (this.state.count % 2 === 1) {
          this.setState(state => ({count: state.count + number}))
        }
    
      }

      //异步自加，此处用隔一秒加模拟异步
      incrementAsync = () => {
        const number = this.numberRef.current.value * 1
        setTimeout(() => {
          this.setState(state => ({count: state.count + number}))
        }, 1000)
      }

    render(){
        const count = this.state.count
        return(
            <div>
                <p>click {count} times</p>
                <select ref={this.numberRef}> {/**【2】使用ref */}
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