import React,{Component} from 'react'
import login from '../../assets/images/logo.png'
import './login.less'
import { Form, Icon, Input, Button, message } from 'antd';
import {reqLogin} from '../../api/' //因为api文件夹下有index.js所以只要指定到文件夹即可
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {Redirect} from 'react-router-dom'


class Login extends Component{
    constructor(props){
        super(props);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async(err, values) => {
          if (!err) {//本地校验成功后执行
            //console.log('在此处发起axios请求验证用户名，密码', values);
            const {username,password}=values
            const result=await reqLogin(username,password)
            if (result.status===0){//登录成功执行的代码
                message.success('登陆成功')
                // 保存user
                const user = result.data
                memoryUtils.user = user // 保存在内存中
                storageUtils.saveUser(user) // 保存到local中

                //跳转到后台界面 或 this.props.history.replace('/')不提供后退功能
                this.props.history.push('/') //替换跳转，可以后退
            }else{//登录失败执行的部分
                message.error(result.msg)
            }
            // reqLogin(username,password).then(response=>{
            //     console.log(response.data)
            // }).catch()
          }else{
              console.log('验证失败')
          }
        });
      };

    // 密码校验
    validatePwd=(rule,value,callback)=>{
        console.log('validatePwd()', rule, value)
        if(!value){
            callback('密码必须输入！')
        }else if(value.length<4){
            callback('密码必须大于4位')
        }else if(value.length>12){
            callback('密码不能超过12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须由字母、数字、下划线组成')
        }else{
            callback() //本地验证成功
        }
    }

    render(){
        // 如果用户已经登陆, 自动跳转到管理界面/admin
        const user = memoryUtils.user
        if(user && user._id) {
            return <Redirect to='/'/>
        }


        //const form = this.props.form
        //const { getFieldDecorator }=form
        const {getFieldDecorator}=this.props.form  //以上两句合二为一，得到具有强大功能的form对象

        
        return(
           <div className='login'>

               <header className='login-header'>
                   <img src={login} />
                   <h1>深蓝后台管理系统</h1>
               </header>

               <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {
                                getFieldDecorator('username',{
                                    rules:[
                                        {required:true,whitespace:true,message:'用户名必须输入！'},
                                        {min:4,message:'用户名必须大于4位'},
                                        {max:12,message:'用户名最多只能12位'},
                                        {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名只能是字母、数字、下划线'}
                                    ],
                                    //initialValue:'admin' //默认显示值
                                })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    />)
                            }
                            
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    rules:[
                                        { validator: this.validatePwd}
                                    ]
                                })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    />)
                            }
                            
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
               </section>

           </div> 
        )
    }
}
const WrapLogin = Form.create()(Login)
export default WrapLogin
