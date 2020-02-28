import React,{Component} from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'
import PropTypes from 'prop-types' //接收父组件传值组件

const Item=Form.Item
const Option=Select.Option

class UpdateCateForm extends Component{
    //把从父组件接收过来的属性参数接收过来
    static propTypes={
        categoryName:PropTypes.string.isRequired,
        //设置setForm类型为函数且必须
        setForm:PropTypes.func.isRequired, 
    }

    //在此组件渲染之前调用一次setForm函数，把form传到父组件去
    componentWillMount(){
        //将form对象通过setForm函数传给父组件
        this.props.setForm(this.props.form)
    }

    render(){
        //把categoryName解构出来
        const {categoryName} = this.props
        const { getFieldDecorator } = this.props.form
        return(
            <Form>
                {/*<Item>
                    <span>所属分类：</span>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(                            
                            <Select>
                                <Option value='1'>一级分类</Option>
                            </Select>
                          )
                    }
                    
                </Item>*/}

                <Item>
                    {/**因为getFiledDecorator接收的标签必须为Form标签，因此span必须拿出来 */}
                    <span>修改分类名：</span>
                    {
                        getFieldDecorator('categoryName',{
                            //文本框默认值为父组件传过来的对应条目数据的名字
                            initialValue:categoryName,
                            //【1】加入规则【2】到父组件内写验证
                            rules:[
                                {required:true,message:'分类名称必须输入'}
                            ]
                        })(
                            
                            <Input type='text' placeholder='请输入子分类名称' />
                        )
                    }

                </Item>

            </Form>
        )
    }
}
export default Form.create()(UpdateCateForm);