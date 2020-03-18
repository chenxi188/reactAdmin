import React,{Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal, //弹窗
    message
} from 'antd'
import {PAGE_SIZE} from '../../../utils/constans'
import {reqRoles,reqAddRole} from '../../../api' //【1】添加角色api
import AddForm from './addForm'


export default class Role extends Component{
    state={
         roles:[], //所有角色列表：连接Table datasource
         role:{},//选中的role
         isShowAdd: false, //是否显示添加界面
    }

    //点击角色列表对应行的行为
    onRow=(role)=>{
        return{
            onClick: event => { //点击行时执行以下
                console.log('row onClick()', role)
                this.setState({ //把当前点击的行赋值到state里的role
                    role
                })
            }
        }
    }

    //获取角色列表数据，设置到state中
    getRoles=async()=>{
        const result=await reqRoles()
        if(result.status===0){
            const roles=result.data
            this.setState({
                roles
            })
        }
    }

    //初始化表格列标题，及对应的数据源，dataIndex:对应api返回的数据名
    initColumns=()=>{
        this.columns=[
            {title:'角色名称',dataIndex:'name'},
            {title:'创建时间',dataIndex:'create_time'},
            {title:'授权时间',dataIndex:'auth_time'},
            {title:'授权人',dataIndex:'auth_name'},           
        ]
    }
    //【2】点添加角色弹窗的ok按钮：添加角色
    addRole=()=>{
        this.form.validateFields(async(err,value)=>{
            if(!err){
                console.log(value)
                //隐藏确认框
                this.setState({isShowAdd:false})
                //收集数据
                const {roleName}=value
                this.form.resetFields()//清空表单内数据，方便下次使用

                //添加角色请求
                const result=await reqAddRole(roleName)
                if(result.status===0){
                    message.success('角色添加成功')
                    //取出返回的新增role值
                    const role=result.data
                    //更新roles状态，使新增的角色显示出来(基于原本状态数据更新)
                    this.setState(state=>({
                        roles:[...state.roles,role]
                    }))
                    
                }else{
                    message.error('角色添加失败')
                }
            }
        })
    }

    componentWillMount(){
        this.initColumns() //函数：运行初始表格列标题，及对应的数据源函数，把表格列数据赋值到this.columus上
    }

    componentDidMount(){
        this.getRoles() //函数：获取角色列表设置到state中
    }


    render(){
        const {roles,role,isShowAdd}=this.state //取出isShowAdd

        //card的左侧 （Button的disabled:按钮不可用）
        const title=(
            <span>
                {/* 点创建角色：显示创建角色的弹窗 */}
                <Button type='primary' style={{marginRight:8}} onClick={()=>{this.setState({isShowAdd:true})}}>创建角色</Button>
                <Button type='primary' disabled={!role._id}>设置角色权限</Button>
            </span>
        )
                
        return(
            <Card title={title}>
                <Table
                bordered /**边框 */
                rowKey='_id' /**表格行 key 的取值，可以是字符串或一个函数 */
                dataSource={roles} /**数据源 */
                columns={this.columns} /**列标题，及对应的数据源 */
                pagination={{defaultPageSize:PAGE_SIZE}} /**分页设置默认分页数量 */
                rowSelection={{type:'radio',selectedRowKeys:[role._id]} } /**selectedRowKeys根据4确定哪个是被选中状态；   第行前面加一个单选框antd文档找使用方法 */
                onRow={this.onRow} /**控制点击当前行的行为 */
                 />

                {/* 添加角色弹窗 */}
                 <Modal 
                 title='添加角色'
                 visible={isShowAdd} /*弹窗可见状态*/
                 onOk={this.addRole} /*点ok提交信息*/
                 onCancel={()=>{
                     this.setState({isShowAdd:false})
                     this.form.resetFields()//取消时顺便清空表单方便下次使用
                    }} /*点取消*/
                 >
                     {/* 传递子组件form的函数setForm:（接收一个参数form，令当前组件的form=传过来的form） */}
                     <AddForm setForm={(form) => this.form = form} />
                 </Modal>
            </Card>
        )
    }
}