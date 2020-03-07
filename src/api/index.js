import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd' //借用antd返回信息组件
// const BASE = 'http://localhost:5000'
const BASE = ''

//导出一个函数，第1种写法
//登录接口函数
// export function reqLogin(username,password){
//     return ajax('login',{username,password},'POST')
// }

//导出一个函数，第2种写法
// 登录接口函数
export const reqLogin=(username,password)=>ajax(BASE+'login',{username,password},'POST')


//获取产品一级/二级分类列表接口
export const reqCategorys=(parentId)=>ajax(BASE+'/manage/category/list',{parentId})
//添加产品分类接口
export const reqAddCategory=(parentId,categoryName)=>ajax(BASE+'/manage/category/add',{parentId,categoryName},'POST')
//修改产品分类接口
export const reqUpdateCategory=({categoryId,categoryName})=>ajax(BASE+'/manage/category/update',{categoryId,categoryName},'POST')
//根据分类Id获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', {categoryId})

//获取产品列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/manage/product/list',{pageNum,pageSize})

/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType(搜索的类型): productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName,
  })
  
//添加商品/修改商品：二合一接口，如果参数存在._id则为修改商品，否则为添加商品
export const reqAddUpdatePro=(product)=>ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')


// 删除服务器上指定名称图片
export const reqDeletPic=(name)=>ajax(BASE+'/manage/img/delete',{name},'POST')







// 天气接口
export const reqWeather=(city) => {    
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    //返回一个promise函数
    return new Promise((resolve,reject) => {
        //发送一个jsonp请求
        jsonp(url,{},(err,data) => {
            //输出请求的数据到控制台
            console.log('jsonp()', err, data)
            //如果请求成功
            if(!err && data.status==='success'){
                //从数据中解构取出图片、天气
                const {dayPictureUrl,weather}=data.results[0].weather_data[0]
                //异步返回图片、天气给调用函数者
                resolve({dayPictureUrl,weather})
            }else{//如果请求失败
                message.error('天气信息获取失败')
            }
        })
    })
}
//reqWeather('上海')