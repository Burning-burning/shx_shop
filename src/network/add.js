import { request } from './request'
export const addGoods = (goods_name, goods_cat, goods_price, goods_number, goods_weight, goods_introduce, pics, attrs) => request({
  url: 'goods',
  method: 'post',
  data: {
    goods_name,
    goods_cat,
    goods_price,
    goods_number,
    goods_weight,
    goods_introduce,
    pics,
    attrs
  }
})