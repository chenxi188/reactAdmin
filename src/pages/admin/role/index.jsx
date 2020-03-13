import React,{Component} from 'react'
import {
    Card,
    Button,
    Table,
    message
} from 'antd'
import {PAGE_SIZE} from '../../../utils/constans'
import {reqRoles} from '../../../api'

export default class Role extends Component{
    state={
         roles:[], //所有角色列表：连接Table datasource
         role:{},//【2】选中的role
    }

    //【1】点击角色列表对应行的行为
    onRow=(role)=>{
        return{
            onClick: event => { //点击行时执行以下
                console.log('row onClick()', role)
                this.setState({ //【3】把当前点击的行赋值到state里的role
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

    componentWillMount(){
        this.initColumns() //函数：运行初始表格列标题，及对应的数据源函数，把表格列数据赋值到this.columus上
    }

    componentDidMount(){
        this.getRoles() //函数：获取角色列表设置到state中
    }


    render(){
        const {roles,role}=this.state //【4】取出role

        //card的左侧 （Button的disabled:按钮不可用）
        const title=(
            <span>
                <Button type='primary' style={{marginRight:8}}>创建角色</Button>
                <Button type='primary' disabled>设置角色权限</Button>
            </span>
        )
                
        return(
            <Card title={title}>
                <Table
                bordered /**边框 */
                rowKey='_id' /**【5】表格行 key 的取值，可以是字符串或一个函数 */
                dataSource={roles} /**数据源 */
                columns={this.columns} /**列标题，及对应的数据源 */
                pagination={{defaultPageSize:PAGE_SIZE}} /**分页设置默认分页数量 */
                rowSelection={{type:'radio',selectedRowKeys:[role._id]} } /**【6】selectedRowKeys根据4确定哪个是被选中状态；   第行前面加一个单选框antd文档找使用方法 */
                onRow={this.onRow} /**【0】控制点击当前行的行为 */
                 />
            </Card>
        )
    }
}