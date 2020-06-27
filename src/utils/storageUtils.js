/*
保存用户名到localStorage
*/
import store from 'store'
const USER_KEY='user_key' //定义localStorage内的键名为user_key

export default{
    //1.保存user到localStorage
    saveUser(user){
        //localStorage.setItem(USER_KEY,JSON.stringify(user)) //原生localStorage写法，下同
        store.set(USER_KEY,user)  //store库写法，自动把user解析为字典
    },

    //2.从localSorage读取user
    getUser () {
        // return JSON.parse(localStorage.getItem(USER_KEY)||'{}') //如果没有得到数据，就返回空字典
        return store.get(USER_KEY) || {}
    },

    //3.从localStorage删除user
    removeUser (){
        //localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}