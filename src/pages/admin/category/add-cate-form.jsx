import React,{Component} from 'react'
import {
    Form,
    Select,
    Input
} from 'antd';
import PropTypes from 'prop-types' //引入父子传值模块

const Item=Form.Item
const Option=Select.Option

class AddCateForm extends Component{
    //引入父组件的相关信息
    static propTypes={
        categorys:PropTypes.array.isRequired, //父组件的一级分类列表 
        parentId:PropTypes.string.isRequired, //父组件传过来的当前产品分类的parentId
        setForm:PropTypes.func.isRequired,//用来接收父组件传过来的接收子组件form对象的函数
    }
    //把当前组件的form作为参数运行一下父组件传过来的[接收子组件form对象函数]，从而实现父组件也有form对象
    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render(){
        //到父组件category/index.jsx下把categorys[],parentId,from对象传过来
        //取出父组件传过来的categorys,parentId
        const {categorys, parentId} = this.props
        const { getFieldDecorator } = this.props.form
        return(
            <Form>
                <Item>
                    <span>所属分类：</span>
                    {
                    /*令inintalValue=parentId（实现在子分类点添加分类时一级分类自动显示对应分类）、
                    把一级分类动态写入（实现自动调取所有一级分类）、回到父组件实现功能*/
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(                            
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(c=> <Option value={c._id}>{c.name}</Option>)
                                }
                            </Select>
                          )
                    }
                    
                </Item>

                <Item>
                    <span>添加子分类：</span>
                    {
                        getFieldDecorator('categoryName',{
                            //【1】在字段装饰器加入规则【2】到父组件内写验证
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
export default Form.create()(AddCateForm);