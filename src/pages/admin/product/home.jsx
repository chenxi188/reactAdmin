import React,{Component} from 'react'
import {
    Card,
    Select,
    Input,
    Table,
    Icon,
    Button,
    message
} from 'antd'
import LinkButton from '../../../components/link-button'
import {reqProducts,reqSearchProducts} from '../../../api/' //【0】引入产品列表请求
import {PAGE_SIZE} from '../../../utils/constans' //引入常量每页显示产品条数PAGE_SIZE=3


const Option=Select.Option

export default class Home extends Component{
    state={
        //商品列表
        total:0,//商品总数
        products:[], 
        loading:false,
        searchName:'', //【1】搜索关键词
        searchType:'productName', //【2】按什么搜索：名称/描述 productName/productDesc
    }
    //Table的列名及对应显示的内容渲染
    initColumns=()=>{
        this.columns=[
            {
                title:'商品名称',
                dataIndex:'name'
            },
            {
                title:'商品描述',
                dataIndex:'desc'
            },
            {
                title:'价格',
                dataIndex:'price',
                render:(price)=>'￥'+price //把price渲染进对应的行，并加上￥符号
            },
            {
                width:100,
                title:'商品状态',
                dataIndex:'status',
                render:(status)=>{
                    return(
                        <span>
                            <Button type='primary'>{status===1 ? '下架' : '上架'}</Button>
                            <span>{status===1 ? '在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title:'操作',
                
                render:(proObj)=>{
                    return(
                        <span>
                            <LinkButton>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    //请求产品列表放入state，后台分页
    getProducts=async(pageNum)=>{//pageNum为请求页码
        this.setState({loading:true}) //设置加载动画开始显示
        this.pageNum=pageNum //保存pageNum, 让其它方法可以看到

        const {searchName,searchType}=this.state  //【10】
        let result //【13】有两个result因此把result提出来定义
        if(searchName){//【11】如果有搜索关键词就是关键词搜索，易错pageSize:PAGE_SIZE
            result=await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
        }else{//【12】否则就是一般搜索
            result = await reqProducts(pageNum,PAGE_SIZE) // 常量：每页显示产品条数，
        }
    
        this.setState({loading:false}) //关闭加载动画
        if(result.status===0){
            console.log(result.data)
            const {total,list}=result.data          
            this.setState({
                total,
                products:list
            })
        }else{
            message.error('加载产品失败，请刷新页面重试')
        }
    }

    componentWillMount(){
        //Table列名初始化函数调用，用于准备表格列名及显示内容
        this.initColumns()
    }

    //获取产品
    componentDidMount(){
        this.getProducts(1)       
    }

    render(){
        //【3】state数据解构，简化使用
        const {products,loading,total,searchName,searchType}=this.state

        //【4】card左侧内容
        const title=(
            <span>
                <Select 
                value={searchType} /*【5】*/
                style={{width:150,}} 
                onChange={value=>this.setState({searchType:value})}/*【6】*/
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 8px'}} 
                value={searchName}/*【7】*/
                onChange={event=>this.setState({searchName:event.target.value})}/*【8】*/
                 />
                <Button type='primary'
                onClick={()=>this.getProducts(1)} //【9】点击搜索对应产品
                >搜索</Button>
            </span>
        )
        //card右侧内容
        const extra=(
            <Button type='primary' onClick={() => this.props.history.push('/product/add-update')}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )
        return(
            <Card title={title} extra={extra}>
                <Table 
                bordered 
                rowKey='_id'
                dataSource={products}
                loading={loading}
                columns={this.columns}
                pagination={{/*分页配置*/
                    current: this.pageNum,
                    total,
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true,
                    onChange: this.getProducts /*onchange是一回调函数，把pageNum传给getproducts,等于：(pageNum)=>{this.getProducts(pageNum)}*/
                }} 
                />
                
            </Card>
        )
    }
}
