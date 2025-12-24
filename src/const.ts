import { FieldType } from '@lark-base-open/js-sdk'

// 车款信息字段:品牌名称 车款id 车款名称 车系名称 年款
export const carInfoFieldNames = [
  {
    name: '车款名称',
    type: FieldType.Text,
    fieldName: 'car_name'
  },
  {
    name: '车系名称',
    type: FieldType.Text,
    fieldName: 'series_name'
  },
  {
    name: '品牌名称',
    type: FieldType.Text,
    fieldName: 'brand_name'
  },
  {
    name: '车款id',
    type: FieldType.Text,
    fieldName: 'car_id'
  },
  {
    name: '年款',
    type: FieldType.Text,
    fieldName: 'year'
  }
]
