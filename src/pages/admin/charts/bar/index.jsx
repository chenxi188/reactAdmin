import React,{Component} from 'react'
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react' //【1】引入图表


export default class Bar extends Component{
    // 【4】设置状态
    state={
        sales:[50, 20, 36, 10, 20, 20], //销量
        stocks:[10,20,30,40,50,60] //库存
    }


    //【5】更新数据状态
    update=()=>{
        this.setState(state=>({
            sales:state.sales.map(sale=>sale+1), //用map方法逐个处理数组
            stocks:state.stocks.reduce((pre,stock)=>{ //用reduce方法逐个处理数组，此处是map方法快捷
                pre.push(stock-1)
                return pre
            },[]),
        }))
    }


    //【3】图表要展示的数据对象
    getOption=(sales,stocks)=>{
        return{
            title: {
                text: 'ECharts 销量库存示例图'
            },
            tooltip: {},
            legend: {
                data:['销量','库存']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: sales
            },{
                name:'库存',
                type:'bar',
                data:stocks
            }]
        }
    }



    render(){
        // 【6】解构取出状态内数据
        const {sales,stocks}=this.state
        return(
            <div className='bar'>
                <Card>
                    <Button type='primary' onClick={this.update}>更新</Button>
                </Card>
                <Card title='柱状图一'>
                    {/* 【2】引入图表组件 */}
                <ReactEcharts option={this.getOption(sales,stocks)} />
                </Card>
            </div>
        )
    }
}