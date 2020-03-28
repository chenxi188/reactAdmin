import React,{PureComponent} from 'react'
import {Form,Input,Select} from 'antd'
import PropTypes from 'prop-types'

const Item=Form.Item
const Option=Select.Option

class AddForm extends PureComponent{
 static propTypes={
    setForm:PropTypes.func.isRequired, //接收父组件传过来的setForm函数，用于把当前页面的form功能传给你组件
    roles:PropTypes.array.isRequired, //接收父组件传来的角色列表，用于展示在添加用户的下拉表角色选择中
    user:PropTypes.object.isRequired, //【1】接收父组件传来的用户信息，用于展示在修改用户时的表单中
 }

 componentWillMount(){
     this.props.setForm(this.props.form) //把当前页面的form通过setForm函数传到父组件
 }

 render(){
/**api请求返回数据
 {
    "_id": "5cb05b4db6ed8c44f42c9af2",
    "username": "test",
    "password": "202cb962ac59075b964b07152d234b70",
    "phone": "123412342134",
    "email": "sd",
    "role_id": "5ca9eab0b49ef916541160d4",
    "create_time": 1555061581734,
    "__v": 0
 }
 */

    //表单样式控制
    const formItemLayout = {
        labelCol:{ span: 5,offset:0 },
        wrapperCol:{ span: 15,offset:0 }
      }

    const { getFieldDecorator }=this.props.form //form组件的获取表单验证函数
    const {roles,user}=this.props //解构出roles【2】解构出user
     return(
        //  表单样式控制 {...formItemLayout}
         <Form {...formItemLayout} > 
            
             <Item label='用户名'> 
                 {
                 getFieldDecorator('username',{
                     initialValue:user.username, //【3】展示传过来的要修改的用户名
                     rules:[
                         {required:true,message:'用户名必须输入'},
                         {min:4,max:12,message:'用户名必须大于4位小于12位'}
                        ]
                 })(<Input placeholder='请输入用户名' />)
                 }     
             </Item>

             <Item label='密码'>
                 {
                     getFieldDecorator('password',{
                         initialValue:user.password, //【4】不需要展示修改密码
                         rules:[
                             {required:true,message:'密码必须输出'},
                             {min:4,max:12,message:'密码必须大于4位小于12位'}
                            ]
                     })(<Input type='password' placeholder='请输入密码' />)
                 }           
             </Item>

             <Item label='手机号'>
                 {
                     getFieldDecorator('phone',{
                         initialValue:user.phone, //【5】展示修改的手机
                         rules:[
                             {required:true,pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确的手机号'},
                        ]
                     })(<Input placeholder='请输入手机号' />)
                 }                
             </Item>

             <Item label='邮箱'>
                {
                     getFieldDecorator('email',{
                         initialValue:user.email, //【6】修改的邮箱
                         rules:[
                            {pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                            message: '邮箱格式不正确'},
                            {max: 50,message: '邮箱不得超过50字符'},
                         ]
                     })(<Input placeholder='请输入邮箱' />)
                } 
             </Item>

             <Item label='角色'>
                 {
                     getFieldDecorator('role_id',{
                        rules:[{required:true,message:'角色必须选择'}],
                        initialValue:user.role_id,
                    
                     })( //如果要让select的palceholder有效，此处不能写initialValue
                        <Select placeholder="请选择角色"> 
                            {//把角色写入option中
                                roles.map(role=>{
                                return <Option key={role._id} value={role._id}>{role.name}</Option>
                                })
                            }
                            
                        </Select>
                     )
                 }                 
             </Item>

         </Form>
     )
 }
}
//为当前组件添加一个form对象
export default Form.create()(AddForm)

