import React,{Component} from 'react'
import {
    Card,
    Icon,
    Form,
    Input,
    Cascader,//级联组件
    Button,
    message,
} from 'antd'
import LinkButton from '../../../components/link-button'
import {reqCategorys,reqAddUpdatePro} from '../../../api' //引入添加修改产品函数
import PicturesWall from './pictures-wall'
import RichText from './rich-text'

const {Item}=Form
const {TextArea}=Input


class AddUpdate extends Component{
    constructor(props){
        super(props)
        //创建用于存放指定ref标识的标签对象容器
        this.pw=React.createRef()
        //
        this.editor=React.createRef()

       this.state={
        options:[], //定义状态选项
        } 
    }
    

    //把获取到的categorys解析为options
    initOptions= async (categorys)=>{ //
        const options = categorys.map((v,k)=>({ //返回一个字典，要额外加一个括号            
                value: v._id,
                label: v.name,
                isLeaf: false,             
        }))

    //如果是一个二级分类商品的更新一
    const {isUpdate, product} = this
    const {pCategoryId} = product
    if(isUpdate && pCategoryId!=='0') {//当前功能是商品修改，且，一级分类不为0（父分类为0即表示只有一级分类）
      //获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      //生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))

      //找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value===pCategoryId)

      //关联对应的一级option上
      targetOption.children = childOptions
    }

        this.setState({
            options
        })
    }

    //获取categorys
    getCategorys= async (parentId)=>{
        const result = await reqCategorys(parentId)
        if(result.status===0){
            const categorys = result.data
            // 如果是一级分类列表
            if (parentId==='0') {
                this.initOptions(categorys)
            } else { // 二级列表
                return categorys  // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
            }
        }else{
            message.error('产品分类获取失败请刷新重试')
        }
    }

    //自定义验证：商品价格大于0函数
    valiPrice=(rule, value, callback)=>{
        //console.log(value,typeof(value))  //在价格输入-1即显示是string类型
        if(value*1>0){ //字符串*1：将字符串转化为数字类型
             callback()
        }else{
            callback('价格必须大于0')
        }
    }


    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
      }

      
    //加载二级分类列表函数
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true

        // 根据选中的分类, 请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategorys && subCategorys.length>0) {
        // 生成一个二级列表的options
        const childOptions = subCategorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true
        }))
        // 关联到当前option上
        targetOption.children = childOptions
            } else { // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
            }

            // 更新options状态
            this.setState({
                options: [...this.state.options],
            })        
      }

    //产品表单提交
    submit = () => {
        // 进行表单验证, 如果通过了, 才发送请求
        this.props.form.validateFields(async (error, values) => {
          if (!error) {
    
            // 1. 收集数据, 并封装成product对象
            const {name, desc, price, categoryIds} = values
            let pCategoryId, categoryId
            if (categoryIds.length===1) {
              pCategoryId = '0'
              categoryId = categoryIds[0]
            } else {
              pCategoryId = categoryIds[0]
              categoryId = categoryIds[1]
            }
            const imgs = this.pw.current.getImgs()
            const detail = this.editor.current.getDetail()
    
            const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
    
            // 如果是更新, 需要添加_id
            if(this.isUpdate) {
              product._id = this.product._id
            }
    
            // 2. 调用接口请求函数去添加/更新
            const result = await reqAddUpdatePro(product)
    
            // 3. 根据结果提示
            if (result.status===0) {
              message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
              this.props.history.goBack()
            } else {
              message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
            }
          }
        })
      }

    

    componentWillMount(){
        //取出产品列表修改按钮传过来的state
        const product=this.props.location.state //如果是添加的就没有值，否则就有值
        //保存是否更新标识到this
        this.isUpdate=!!product //双取反,若product有值，结果为ture
        //保存商品到this（如果没有，则保存空对象）
        this.product=product || {}
    }
      
    componentDidMount(){
        this.getCategorys('0') //加载categorys并初始化为
    }
      
    render(){
        //【1】解构需要的数据detail
        const {isUpdate,product}=this
        const{pCategoryId,categoryId,imgs,detail}=product

        // 初始值定义
        const categoryIds=[]
        //如果是一个一级分类商品，则把分类id直接装入数组
        if(pCategoryId==='0'){
            categoryIds.push(categoryId)
        }else{//否则商品是一个二级分类的商品，把两级分类id都装入数组          
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
        }

        //card左
        const title=(
            <span>
                <LinkButton onClick={()=>this.props.history.goBack()}>
                    <Icon type='arrow-left' style={{fontSize:20}} />                   
                </LinkButton>
                {/* 根据值确定显示内容 */}
                <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )
        
        //form内的Item的布局样式
        const formItemLayout = {
            labelCol: {span: 2}, //左侧label标签的宽度占2个格栅
            wrapperCol: {span: 8 }, //右侧（输入框外面有一层包裹）占8个格栅
          };

        //获取from的getFieldDecorator
        const {getFieldDecorator}=this.props.form

        
        

        return(
            <Card title={title} extra=''>
                {/* 使用组件的扩展属性语法 */}
                <Form {...formItemLayout}>
                    {/* label指定商品前面标签名,placeholder指定输入框提示内容 */}
                    <Item label='商品名称'>
                        {//商品名规则
                            getFieldDecorator('name',{
                                initialValue:product.name,//显示要修改的商品名
                                rules:[
                                    {required:true,message:'商品名称必须填写'}
                                ]
                            })(<Input  placeholder='输入商品名' />)
                        }
                        
                    </Item>

                    <Item label='商品描述'>
                        {//autoSize指定文本域最小高度和最大高度
                            getFieldDecorator('desc',{
                                initialValue:product.desc, //
                                rules:[
                                    {required:true,message:'商品描述必须输入'}
                                ]
                            })(<TextArea placeholder='输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />)
                        }                       
                    </Item>

                    <Item label='商品价格'>
                        {//validator自定义验证规则要求价格大于0
                            getFieldDecorator('price',{
                                initialValue:product.price, //
                                rules:[
                                    {required:true,message:'价格必须输入'},
                                    {validator:(rule,value,callback)=>{
                                        if(value*1>0){ //字符串*1：将字符串转化为数字类型
                                            callback() //此处必须进行回调函数调用，否则将无法通过验证
                                       }else{
                                           callback('价格必须大于0')
                                       }
                                    }},
                                ]
                            })(<Input type='number' placeholder='输入商品价格' addonAfter="元" />)
                        }                        
                    </Item>

                    <Item label="商品分类">
                        {//初始值设置为一个变量
                        getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [
                            {required: true, message: '必须指定商品分类'},
                            ]
                        })(<Cascader
                            placeholder='请指定商品分类'
                            options={this.state.options}  /*需要显示的列表数据数组*/
                            loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                            />
                        )
                        }

                    </Item>

                    <Item label='商品图片'>
                        {/* imgs传给子组件 PicturesWall */}
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item> 

                    <Item label='商品详情' labelCol={{span: 2}} wrapperCol={{span: 20}}>
                        {/**指定把richtext对象装进editor里 
                         * 【2】传detail给子组件RichText
                        */}
                        <RichText ref={this.editor} detail={detail} />
                    </Item>

                    <Item >
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>  

                </Form>
            </Card>
        )
    }
}
export default Form.create()(AddUpdate) //包装当前类使得到form的的强大函数