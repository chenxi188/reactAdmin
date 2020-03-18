import React,{Component} from 'react'
import{Form,Input} from 'antd'
import PropTypes from 'prop-types' //【1】传值模块

const Item =Form.Item

class AddForm extends Component{
    static propTypes={
        setForm:PropTypes.func.isRequired //【2】父组件传过来的接收子组件form对象的函数
    }

    componentWillMount () {
        //【3】运行接收到的父组件传过来函数，把form传给父组件
        this.props.setForm(this.props.form)
      }

    render(){
        // 取出form的表单验证方法
        const { getFieldDecorator } = this.props.form
        // 【2.1】指定Item布局的配置对象
        const formItemLayout = {
        labelCol: { span: 4 },  // 左侧label的宽度
        wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }

        return(
            <Form>
                {/* 【2.2】把formItemLayout放入Item */}
                <Item label='角色名称' {...formItemLayout}>
                {
                    getFieldDecorator('roleName', {
                    initialValue: '',
                    rules: [
                        {required: true, message: '角色名称必须输入'}
                    ]
                    })(
                    <Input placeholder='请输入角色名称'/>
                    )
                }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm) //包装AddForm组件使具体form相关方法