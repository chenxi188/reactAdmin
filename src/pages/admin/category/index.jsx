import React,{Component} from 'react'
import './index.less'
import {
    Button,
    Card,
    Table,
    Icon, 
    Modal, //引入对话框
    message,} from 'antd';
import LinkButton from '../../../components/link-button'
import {reqCategorys,reqAddCategory,reqUpdateCategory} from '../../../api/' //获取api接口请求函数
import AddCateForm from './add-cate-form'; //添加分类表单
import UpdateCateForm from './update-cate-form'; //导入更新分类的表单

export default class Category extends Component{
    state={
        loading:false, //控制是否显示加载动画
        parentId:'0', //初始为0即请求一级产品分类列表        
        categorys:[], //存放api接口获取的分类列表
        parentName:'', //当前子分类的对应父分类名
        subCategorys:[], //子分类列表数据
        showStatus:0, //添加分类、更新分类显示状态，0：都不显示，1：显示添加，2：显示更新
    }

   
    //异步请求一级分类列表
    getCategorys = async (parentId)=>{
        this.setState({loading:true}) //设置加载中动画状态显示
        parentId=parentId || this.state.parentId //parentId等于传进来的参数或state里的值
        const result=await reqCategorys(parentId) //把0改为从state内动态获取，请求分类数据并赋值给result
        if(result.status===0){ //如果返回的status=0，说明返回成功，执行：
            console.log(result.data) //测试输出返回的数据
            const categorys=result.data //把返回数据赋值给categorys

            //如果parentId=0则是一级列表，执行：
            if(parentId==='0'){ 
                this.setState({
                    categorys, //（因为名称和state标签名相同，所以用简写）把返回的一级产品分类数据，赋值给state里
                    loading:false, //数据加载完成，取消loading动画显示
                })
            }else{//否则是二级列表，执行：
                this.setState({
                    subCategorys:categorys, //把返回的二级产品分类数据，赋值给state里
                    loading:false, //数据加载完成，取消loading动画显示
                })
            }
            
        }else{
            message.error('获取分类列表失败')
        }
    }

    //显示一级分类对应二级产品分类函数
    showSubCategory=(category)=>{
        //先更新状state的parentId为对应新分类的id
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{/*setState是异步执行，并不会马上更新完状态，
            因此需在其内部写（在状态更新且重新render()后执行）*/
            console.log('parentId',this.state.parentId)
            this.getCategorys()//获取二级分类列表
        })

    }

    //显示一级分类函数,设置id状态即可
    showCategorys=()=>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[],
        })
    }

    //初始化表格column列名函数    
    initColumn=()=>{
        //表格列名
        this.columns = [
          {
            title: '分类名',
            key: 'name',
            dataIndex: 'name',
          },
          {
            title: '操作',
            width:'29%',           
            render: (categoryObj) => (//category代表当前条目对象(名字随意)，用于返回需要显示的界面标签
                <span>
                    {/*把当前条目的数据对象传递给updateCate函数 */}
                    <LinkButton onClick={()=>this.showUpdateCate(categoryObj)}>修改分类</LinkButton>
                    {/*
                    添加事件监听点击时调用显示函数
                    因为如果加括号及参数就会自动执行函数，而不是点击后才执行，所以用一个匿名函数把它包起来
                    如果parentId=0即是父级列表则显示查看子分类按钮，否则什么也不显示
                    */}
                    {this.state.parentId==='0'?<LinkButton onClick={()=>{this.showSubCategory(categoryObj)}}>查看子分类</LinkButton>:null}
                </span>
            ),
          },
          
        ];
    }


    //显示添加分类函数
    showAddCate= async (parentId,categoryName)=>{
        this.setState({
            showStatus:1
        })        
    }

    //更新分类函数updateCate,接收[2]传来的对应条目数据对象
    showUpdateCate=(categoryObj)=>{
        //接收参数赋值到当前函数
        this.categoryObj=categoryObj
        this.setState({
            showStatus:2
        })
    }

    //取消对话框函数handleCancel
    handleCancel=()=>{
        //重置所有表单数据，防止上一条数据修改后点取消，下一条使用缓存，点其它条目时展示上一条修改的数据
        this.form.resetFields()
        this.setState({
            showStatus:0
        })
    }


    //执行添加分类：
    addCate= ()=>{
        //【1】antd表单验证函数
        this.form.validateFields(async (err,values)=>{
            if(!err){//【2】把所有提交数据要执行的代码都放入表单验证无错误之后
                //1.获取表单数据
                // const {parentId,categoryName}=this.form.getFieldsValue()
                //【3】注释旧上一行，改成从values里解构需要的数据
                const {parentId,categoryName}=values
                //2.清除表单数据
                this.form.resetFields()
                const result = await reqAddCategory(parentId,categoryName)
                if(result.status===0){//3.如果添加成功：
                    // 如果新添加的分类就是当前分类下的子分类（当前表单显示的parentId=状态中的parentId）：
                    if(parentId===this.state.parentId){
                        //隐藏对话框,提示添加成功
                        this.setState({showStatus:0})
                        message.success('产品分类添加成功')
                        //重新加载请求并展示添加之后的产品分类
                        this.getCategorys()
                    }else if(parentId==='0'){//如果添加的是一级分类（parentId===0），则需获取一级分类，但无需显示
                        //正常要重新设置state里的parentId=0然后再请求一次，但这样会造成跳转到一级分类
                        //因此把parentId直接做为参数传到getCategorys()里，这样就不会跳转显示一级分类，还是在二级分类里了
                        this.getCategorys('0')
                        //隐藏对话框,提示添加成功
                        this.setState({showStatus:0})
                        message.success('产品分类添加成功')
                    }else{
                        message.error('不能添加其它分类的子分类！')
                    }
                    
                }else{//6.添加失败：
                    message.error('产品分类添加失败')
                }
            }
        })
        
    }


    //执行修改分类（点对话框的ok按钮执行此函数）
    updateCate= ()=>{
        //【1】表单的验证函数
        this.form.validateFields(async(err,values)=>{
            //【2】如果没错
            if(!err){
                //1.点ok后隐藏对话框
                this.setState({showStatus:0})
                //2.准备数据
                const categoryId=this.categoryObj._id 
                //从子组件update-cate-form.jsx组件获取要修改的分类名
                //const categoryName=this.form.getFieldValue('categoryName') //取this的form对象
                //【3】注释上一行，改成如下从values解构
                const {categoryName}=values
                // console.log('categoryId:',categoryId)
                // console.log('categoryName:',categoryName)
                //重置所有表单数据，防止使用缓存，造成点其它条目时展示上一条修改的数据
                this.form.resetFields()
                //3.发送请求更新分类
                const result = await reqUpdateCategory({categoryId,categoryName})
                
                if(result.status===0){
                    message.success('产品分类修改名称成功')
                    //4.重新显示修改名称后的分类列表
                    this.getCategorys()
                }else{
                    message.error('产品分类修改名称失败')
                }
            }
        })
    
        
    }

    // 页面完成加载后运行，用于异步加载等函数存放
    componentDidMount(){
        this.getCategorys() //获取表格数据源
    }

    // 页面将要加载运行：用于页面渲染前的数据准备
    componentWillMount(){
        this.initColumn() //准备表格列名相关数据
        //this.addCate('5e41578325a557082c18f43b','洗衣机')
    }
    
    render(){
        // 对state里数据解构：
        const {categorys,subCategorys, parentId,parentName,loading,showStatus}=this.state
        //把4步收到的参数赋值给categoryObj
        const categoryOjb = this.categoryObj || {} // 如果还没有，则指定一个空对象

        //卡片标题，如果是一及分类显示 一级分类列表，否则显示一级分类+链接+对应的一级分类名
        const title= parentId==='0'?'一级分类列表':(
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton> >>  
            <span>{parentName}</span>
            </span>
        )
        //卡片右侧添加按键：添加监听
        const extra=(
            <Button type='primary' onClick={this.showAddCate}>
                <Icon type='plus'/>
                添加
            </Button>
        )
       
        return(
            <div className='category'>
                   {/*卡片样式组件*/}             
                <Card title={title} extra={extra} >
                    {/*
                    表格组件、边框、key为数据源的_id、
                    数据源、如果parentId为0设置一级分类列表为数据源、否则二级分类为列表源
                    列名定义、
                    一页显示数据条数，显示快速跳转
                    */}
                    <Table 
                    bordered
                    rowKey='_id'
                    dataSource={parentId==='0'? categorys:subCategorys} 
                    columns={this.columns} 
                    loading={loading}
                    pagination={{defaultPageSize: 5, showQuickJumper: true}}
                    />


                    {/*添加对话框：0：都不显示，1：显示添加分类，2：显示更新分类
                    添加监听函数：addCate,updateCate,handleCancel 
                    使用<AddCateForm组件
                    
                    */}
                    <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk={this.addCate}
                    onCancel={this.handleCancel}
                    >
                    {/**把categorys，和parentId、接收子组件from对象的函数、传到子组件add-cate-form.jsx里面 */}
                    <AddCateForm 
                    categorys={categorys} 
                    parentId={parentId}
                    setForm={(form)=>{this.form=form}}
                     />
                    </Modal>

                    {/*
                    在updateCateForm组件加一个参数categoryName用于传给子组件，
                    实现更新时显示当前条目的产品分类名称
                    转到update-cate-form.jsx内接收传过来的参数categoryName
                    onOk点执行updateCate函数执行分类名修改
                     */}
                    <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk={this.updateCate}
                    onCancel={this.handleCancel}
                    >
                    {/*接收子组件传来的form对象（向子组件传递带参数的函数，子组件调用它，再把from对象通过参数传回来）
                    子组件把form对象传来之前，将其赋值到this.from里
                    下接update-cate-form.jsx*/}
                    <UpdateCateForm 
                    categoryName={categoryOjb.name}
                    setForm={(form)=>{this.form=form}}
                    />
                    </Modal>

                </Card>
            </div>
        )
    }
}