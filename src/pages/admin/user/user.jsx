import React,{Component} from 'react'
import {Card,Button,Table,Modal,message} from 'antd'
import LinkButton from '../../../components/link-button/index'
import {reqUsers,reqUserDel,reqUserAdd} from '../../../api' //reqUserAdd
import {formateDate} from '../../../utils/dateUtils'
import AddForm from './add-form' //引入添加表单内容

export default class User extends Component{
    state ={
        users:[],//用户列表
        roles:[],//所有角色列表
        isShow:false,//控制Modal弹窗是否显示
    }


    //把状态里的roles[]数据转换成以role._id为键名，role.name为键值的字典
    initRoleNames=(roles)=>{
        const roleNames=roles.reduce((pre,role)=>{
            pre[role._id]=role.name
            return pre
        },{})
        //保存到this
        this.roleNames=roleNames
    }

    //表格的列数据指定
    initColumns=()=>{
        this.columns=[
            {title:'用户名',dataIndex:'username'},
            {title:'邮箱',dataIndex:'email'},
            {title:'电话',dataIndex:'phone'},
            {title:'注册时间',dataIndex:'create_time',render:formateDate}, //完整写法：render:()=>{formateDate('create_time')}
            {title:'所属角色',dataIndex:'role_id',
             render:(role_id)=>this.roleNames[role_id] //根据Id展示对应的角色名； 旧写法(role_id) => this.state.roles.find(role => role._id===role_id).name //name取自roles.name
            },
            {
                title:'操作',
                render:(user)=>(//【1】传入user到更新中
                <span>
                    <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                    <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                </span>)               
            }
        ]
    }

    //获取用户列表
    getUsers=async()=>{
        const result=await reqUsers()
        if (result.status===0){
            const {users,roles}=result.data
            this.initRoleNames(roles)//把获取的角色数据传过去，生成roleNames的字典
            this.setState({
                users,
                roles
            })
        }
    }

    //删除指定用户
    deleteUser=(user)=>{
        Modal.confirm({
            title: `确定要删除${user.username}用户吗`,
            content: '删除后将不可恢复',
            onOk: async () => { //需要用async写法 原：onOk() {}
              const result = await reqUserDel(user._id)
              if(result.status===0){
                  message.success('删除用户成功')
                  this.getUsers()//删除之后更新列表
              }
            }//onCancel之后什么也不做因此省略
          }) //Modal.confirm 用法详见antd文档3.x的 使用 confirm() 可以快捷地弹出确认框。
    }

    //Modal弹窗点ok后添加用户
    handleOk=()=>{
        //表单验证是否通过函数
        this.form.validateFields(async(err,values)=>{
            if(!err){//如果本地表单验证通过
                this.setState({isShow:false}) //关闭弹窗
                //1.收集表单数据
                const user=values
                console.log(user)
                //【8】重要：如果是修改（判断user是否存在 ）则要把user._id也传过去
                if(this.user){
                    user._id=this.user._id
                }
                this.form.resetFields() //清空表单方便下次使用
                //2.提交表单
                const result=await reqUserAdd(user)
                //3.更新列表
                if(result.status===0){//【9】显示对应提示
                    message.success(`${this.user ? '修改':'添加'}用户成功`)
                    this.getUsers() //更新用户列表
                    
                }
            }
        })
        
    }

    //Modal弹窗点cancel，关闭弹窗
    handleCancel=()=>{
        this.setState({isShow:false})
        this.form.resetFields() //清空表单方便下次使用
    }

    //【2】修改(更新)用户
    showUpdate=(user)=>{
        this.user=user //保存user到this
        this.setState({isShow:true}) //显示更新表单弹窗（此处和添加用的是同一表单弹窗）
    }

    //【6】显示添加或修改的弹窗表单
    showAdd=()=>{
        this.user = null //【7】重要：清除修改时建立的user防止点修改后再点添加 其表单信息依然存在
        this.setState({isShow:true})
    }
    

    
    componentWillMount () {
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

    render(){
        //【5】非常重要：把onclick改为一个单独函数，用来清除修改时建立的user;  卡片标题部分显示Modal弹窗onClick={()=>this.setState({isShow:true})}
        const title=<Button type='primary' onClick={this.showAdd}>创建用户</Button>
        
        //【3】非常重要：让user=修改的user或 添加用户时的空对象，否则添加、修改用户用同一窗口,添加用户时会出错，找不到user发生
        const user = this.user || {}
        return(
            <Card title={title}>
                <Table
                bordered
                rowKey='_id'
                dataSource={this.state.users} 
                columns={this.columns}
                pagination={{defaultPageSize:2}}
                />

                {/* 引入AddForm组件 并把函数 form =>this.form=form 传过去（用于接收子组件传过来的form）*/}
                <Modal
                title={user._id ? '修改用户' : '添加用户'} //【5】如果user id存在就是弹窗标题就是修改用户
                visible={this.state.isShow}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                    <AddForm 
                    setForm={form =>this.form=form}
                    roles={this.state.roles} //把roles角色传给子组件
                    user={user} //【4】把user字典传到子组件中，方便其显示在表单对应用户信息
                    />
                </Modal>


            </Card>
        )
    }
}