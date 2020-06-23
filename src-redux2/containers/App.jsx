import React, {Component} from 'react'
import {connect} from 'react-redux' //引入连接模块
import Counter from '../components/Counter' //引入components下的counter.jsx 注意路径
import {increment, decrement,incrementAsync} from '../redux/actions' //【1】引入redux下的动作incrementAsync

// 指定向Counter传入哪些一般属性(属性值的来源就是store中的state)
const mapStateToProps = (state) => ({count: state})
// 指定向Counter传入哪些函数属性
/*如果是函数, 会自动调用得到对象, 将对象中的方法作为函数属性传入UI组件*/
/*const mapDispatchToProps = (dispatch) => ({
  increment: (number) => dispatch(increment(number)),
  decrement: (number) => dispatch(decrement(number)),
})*/
/*如果是对象, 将对象中的方法包装成一个新函数, 并传入UI组件 */
const mapDispatchToProps = {increment, decrement}

/*
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)*/

//【2】把incrementAsync添加进去
export default connect(
  state => ({count: state}),
  {increment, decrement,incrementAsync},
)(Counter)
