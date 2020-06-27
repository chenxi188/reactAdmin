
//包含n个用来创建action的工厂函数(action creator)
import {INCREMENT, DECREMENT} from './action-types'

/*export function increment(number){
    return {type: INCREMENT, data: number}
}*/

//增加的action
export const increment = number => ({type: INCREMENT, data: number}) //返回对象别忘记加括号

export const decrement = number => ({type: DECREMENT, data: number})