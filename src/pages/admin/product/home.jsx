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
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../../api/' //引入入api请求函数
import {PAGE_SIZE} from '../../../utils/constans' //引入常量每页显示产品条数PAGE_SIZE=3


const Option=Select.Option

export default class Home extends Component{
    state={
        //商品列表
        total:0,//商品总数
        products:[], 
        loading:false,
        searchName:'', //搜索关键词
        searchType:'productName', //按什么搜索：名称/描述 productName/productDesc
    }
    
    //【6】更新商品上下架状态
    updateStatus = async (productId,status)=>{
        const result=await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('商品上下架状态更新成功')
            //【8】更新成功后重新获取正确的商品分页此时传入的页码来源于7步存入的页码
            this.getProducts(this.pageNum)
        }
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
                //dataIndex:'status',//【1】注释掉
                render:(proObj)=>{//【2】传入当前的商品对象
                    const {_id,status}=proObj //【3】解构商品id和status
                    const newStatus=status===1?2:1//【4】把商品的状态2换1，1换2
                    return(
                        <span>
                            <Button 
                            type='primary' 
                            /*【5】调用更新状态函数把当前商品id及要更新的状态传过去*/
                            onClick={()=>this.updateStatus(_id,newStatus)}>
                                {status===1 ? '下架' : '上架'}</Button>
                            <span>{status===1 ? '在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width:100,
                title:'操作',
                
                render:(proObj)=>{//proObj当前商品对象
                    return(
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={()=>this.props.history.push('/product/detail',{proObj})}>详情</LinkButton>
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
        this.pageNum=pageNum //【7】保存pageNum, 让其它方法可以看到

        const {searchName,searchType}=this.state  //
        let result //有两个result因此把result提出来定义
        if(searchName){//如果有搜索关键词就是关键词搜索，易错pageSize:PAGE_SIZE
            result=await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
        }else{//否则就是一般搜索
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
        //state数据解构，简化使用
        const {products,loading,total,searchName,searchType}=this.state

        //card左侧内容
        const title=(
            <span>
                <Select 
                value={searchType} /**/
                style={{width:150,}} 
                onChange={value=>this.setState({searchType:value})}/**/
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 8px'}} 
                value={searchName}/**/
                onChange={event=>this.setState({searchName:event.target.value})}/**/
                 />
                <Button type='primary'
                onClick={()=>this.getProducts(1)} //点击搜索对应产品
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
