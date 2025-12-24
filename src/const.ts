import { FieldType } from '@lark-base-open/js-sdk'

// 车款信息字段:品牌名称 车款id 车款名称 车系名称 年款
export const carInfoFieldNames = [
  {
    name: '品牌id',
    type: FieldType.Text,
    fieldName: 'brand_id'
  },
  {
    name: '车系id',
    type: FieldType.Text,
    fieldName: 'series_id'
  },
  {
    name: '车款id',
    type: FieldType.Text,
    fieldName: 'car_id'
  },
  {
    name: '车款名称',
    type: FieldType.Text,
    fieldName: 'name'
  },
  {
    name: '年款',
    type: FieldType.Text,
    fieldName: 'year'
  },
  {
    name: '错误信息',
    type: FieldType.Text,
    fieldName: 'error'
  }
]
