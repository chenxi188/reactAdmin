import React,{Component} from 'react'
import {Card,Button,Table,Modal,message} from 'antd'
import LinkButton from '../../../components/link-button/index'
import {reqUsers} from '../../../api'
import {formateDate} from '../../../utils/dateUtils'

export default class User extends Component{
    state ={
        users:[]//用户列表
    }

    initColumns=()=>{
        this.columns=[
            {title:'用户名',dataIndex:'username'},
            {title:'邮箱',dataIndex:'email'},
            {title:'电话',dataIndex:'phone'},
            {title:'注册时间',dataIndex:'create_time',render:formateDate}, //render:()=>{formateDate('create_time')}
            {title:'所属角色',dataIndex:'role_id'},
            {
                title:'操作',
                render:()=>(
                <span>
                    <LinkButton onClick={() => this.showUpdate()}>修改</LinkButton>
                    <LinkButton onClick={() => this.deleteUser()}>删除</LinkButton>
                </span>)
                
            }
        ]
    }

    //获取用户列表
    getUsers=async()=>{
        const result=await reqUsers()
        if (result.status===0){
            const {users,roles}=result.data
            this.setState({
                users,
                roles
            })
        }
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