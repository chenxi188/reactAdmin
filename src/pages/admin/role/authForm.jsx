import React,{Component} from 'react'
import {Form,Input,Tree} from 'antd'
import PropTypes from 'prop-types' //父子传值 
import menuList from '../../../config/menuConfig' //导入菜单列表

const Item=Form.Item
const { TreeNode } = Tree //拿出TreeNode

export default class AuthForm extends Component{
    constructor(props){
        super(props)
        //根据传入的角色生成初始状态
        const {menus} = this.props.role
        this.state={
            checkedKeys:menus
        }
    }

    static propTypes={// 接收父传值
        role:PropTypes.object
    }

    //获取菜单列表
    getTreeNodes=(menuList)=>{
        //代替map函数：reduce((初始值pre,当前正在处理的数组item)={},初始值[])
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                {/* 如果有children则调用本函数，把children再运行一次 */}
                {item.children ? this.getTreeNodes(item.children):null}
                </TreeNode>
            )
            return pre
        },[])
    }

    //更新Tree的选中状态
    onCheck=(checkedKeys)=>{
        console.log('oncheck:',checkedKeys)
        this.setState({checkedKeys})
    }


    
  //【1】为父组件提交获取最新menus数据的方法:把state.checkedKeys传给父组件
  getMenus = () => this.state.checkedKeys



    //在页面加载前调用一次菜单
 componentWillMount(){
        this.treeNodes=this.getTreeNodes(menuList)
    }

    //【2】根据新传入的role来更新checkedKeys状态当组件接收到新的属性时自动调用
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps()', nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
    // this.state.checkedKeys = menus
  }



    render(){
        //取出Tree要选中的节点
        const {checkedKeys}=this.state
        // 取出role
        const {role}=this.props

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }
        return(
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    {/* 显示选中的角色名，并让它成不可编辑的状态 */}
                    <Input value={role.name} disabled />
                </Item>

                {/* 到antd复制一个tree进行修改 */}
                <Tree
                    checkable
                    defaultExpandAll={true} /*默认展开所有节点*/
                    checkedKeys={checkedKeys} /*控制哪些节点为选中状态*/
                    onCheck={this.onCheck} /*点击后更改选中状态*/
                >
                    {/* 外面包个根节点，平台权限，内调用3步的treeNodes */}
                    <TreeNode title='平台权限' key='all'>
                        {this.treeNodes}
                    </TreeNode>
                    
                </Tree>
            </div>
        )
    }
}