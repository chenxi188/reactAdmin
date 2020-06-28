import React, {Component} from 'react'
import {Button, Row, Col} from 'antd'
import {connect} from 'react-redux'

import {setHeadTitle} from '../../redux/actions' //引入redux设置头部标题动作
import './not-found.less'

/*
前台404页面
 */
class NotFound extends Component {

  goHome = () => {
    this.props.setHeadTitle('首页') //为防止跳转到首页不显示头部标题加此项
    this.props.history.replace('/home') //跳转到首页
  }

  render() {
    return (

      <Row className='not-found'>
        <Col span={12} className='left'></Col>
        <Col span={12} className='right'>
          <h1>404</h1>
          <h2>抱歉，你访问的页面不存在</h2>
          <div>
            <Button type='primary' onClick={this.goHome}>
              回到首页
            </Button>
          </div>
        </Col>
      </Row>
    )
  }
}

export default connect(
  null,
  {setHeadTitle}
)(NotFound)