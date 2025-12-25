import './App.css'
import { useEffect, useState } from 'react'
import { bitable, IFieldMeta, ITextField } from '@lark-base-open/js-sdk'
import { Button, Select, Toast } from '@douyinfe/semi-ui'
import { getCarInfo } from './api'
import { carInfoFieldNames } from './const'

export default function App() {
  const [metaList, setMetaList] = useState<IFieldMeta[]>([])
  const [selectFieldId, setSelectFieldId] = useState<string>()
  const initTable = async () => {
    const table = await bitable.base.getActiveTable()
    const fieldMetaList = await table.getFieldMetaList()
    // 创建缺失的字段
    const arr = carInfoFieldNames.map(async (field) => {
      const { name: fieldName, type } = field
      if (!fieldMetaList.find((f) => f.name === fieldName)) {
        const id = await table.addField({
          type: field.type as any,
          name: field.name
        })
        return { id, name: fieldName, type }
      }
    })
    const addFieldAll = await Promise.all(arr)
    const addFiled = addFieldAll?.filter((f) => f?.id) as IFieldMeta[]
    const finalList = [...fieldMetaList, ...addFiled]
    setMetaList(finalList)
  }

  useEffect(() => {
    initTable()
  }, [])

  const formatFieldMetaList = (metaList: IFieldMeta[]) => {
    const arr = metaList.map((meta) => ({ label: meta.name, value: meta.id }))
    return arr
  }

  const getCarInfoByVin = async (vin: string) => {
    const info = await getCarInfo(vin)
    const res = {
      error: ' ',
      ...info
    }
    return res
    // return {
    //   series_id: 72720,
    //   brand_id: 78850,
    //   car_id: 252447,
    //   name: '至境L7 2025款 艾维亚',
    //   year: 2025
    // }
  }

  const transform = async () => {
    // 如果用户没有选择的vin码字段，则不进行转换操作​
    if (!selectFieldId) {
      Toast.error('请先选择vin码字段')
      return
    }
    const table = await bitable.base.getActiveTable()
    // 获取vin码字段​
    const vinField = await table.getField<ITextField>(selectFieldId)
    // 首先获取 recordId ​
    const recordIdList = await table.getRecordIdList()
    // 对 record 进行遍历​
    for (const recordId of recordIdList) {
      // 获取当前的vin值​
      const currentVin = await vinField.getValue(recordId)
      const vinValue = currentVin?.[0]?.text
      if (!vinValue) {
        continue
      }
      // 根据vin码获取车款信息​
      const carInfo = await getCarInfoByVin(vinValue)
      // 将车款信息写入对应的字段中​
      carInfoFieldNames.forEach(async (item) => {
        const { name, fieldName } = item
        const target = metaList.find((meta) => meta.name === name)
        const { id } = target as IFieldMeta
        const field = await table.getField(id)
        const val = carInfo[fieldName as keyof typeof carInfo]
        if (val !== undefined) {
          await field.setValue(recordId, val)
        }
      })
    }
  }

  // const transform1 = async () => {
  //   const testVin = 'LS5A3DKE2MA544900'
  //   const res = await getCarInfoByVin(testVin)
  //   console.log('%csrc/App.tsx:93 res', 'color: #007acc;', res)
  // }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        ​<div>选择vin码字段</div> ​
        <Select
          onChange={(v) => setSelectFieldId(v as string)}
          style={{ width: 120 }}
        >
          {formatFieldMetaList(metaList).map((p) => (
            <Select.Option value={p.value} key={p.value}>
              {p.label}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div style={{ marginTop: 20 }}>
        <Button type='primary' onClick={transform}>
          获取车款信息
        </Button>
        {/* <Button type='primary' onClick={transform1}>
          测试
        </Button> */}
      </div>
      ​
    </div>
  )
}
