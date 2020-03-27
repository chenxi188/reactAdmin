import React,{Component} from 'react'
import {Card,Button,Table,Modal,message} from 'antd'
import LinkButton from '../../../components/link-button/index'
import {reqUsers,reqUserDel} from '../../../api' //【1】reqUserDel
import {formateDate} from '../../../utils/dateUtils'

export default class User extends Component{
    state ={
        users:[],//用户列表
        roles:[],//所有角色列表
        isShow:false,//控制弹窗Modal是否显示
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
                render:(user)=>(//【2】传入user到删除中
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

    //【3】删除指定用户
    deleteUser=(user)=>{
        Modal.confirm({
            title: `确定要删除${user.username}用户吗`,
            content: '删除后将不可恢复',
            onOk: async () => { //需要用async写法 原：onOk() {}
              const result = await reqUserDel(user._id)
              if(result.status===0){
                  message.success('删除用户成功')
              }
            }//onCancel之后什么也不做因此省略
          }) //Modal.confirm 用法详见antd文档3.x的 使用 confirm() 可以快捷地弹出确认框。
    }

    
    componentWillMount () {
        this.initColumns()
    }

    componentDidMount(){
        this.getUsers()
    }

    render(){
        //卡片标题部分
        const title=<Button type='primary'>创建用户</Button>
        return(
            <Card title={title}>
                <Table
                bordered
                rowKey='_id'
                dataSource={this.state.users} 
                columns={this.columns}
                pagination={{defaultPageSize:2}}
                />



            </Card>
        )
    }
}