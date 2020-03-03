import React,{Component} from 'react'
import {
    Card,
    List,
    Icon
} from 'antd'
import LinkButton from '../../../components/link-button'
import './product.less'

const Item=List.Item

export default class Detail extends Component{
    render(){

        const title=(
            <span>
                <LinkButton>
                    <Icon type='arrow-left' />
                </LinkButton>
                <span>产品详情</span>
            </span>
        )

        return(
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称</span>
                        <span>笔记本电脑</span>
                    </Item>

                    <Item>
                        <span className='left'>商品描述</span>
                        <span>这是一台笔记本电脑的商品描述</span>
                    </Item>

                    <Item>
                        <span className='left'>商品价格</span>
                        <span>12888元</span>
                    </Item>

                    <Item>
                        <span className='left'>所属分类</span>
                        <span>电脑-->笔记本电脑</span>
                    </Item>

                    <Item>
                        <span className='left'>商品图片</span>
                        <span>
                            <img className='product-img' src='http://localhost:5000/upload/image-1582704160384.jpg' alt=''/>
                            <img className='product-img' src='http://localhost:5000/upload/image-1582704160384.jpg' alt=''/>
                        </span>
                    </Item>

                    <Item>
                        <span className='left'>商品详情</span>
                        <span dangerouslySetInnerHTML={{__html: 'detail'}}></span>
                    </Item>
                </List>
                
            </Card>
        )
    }
}
