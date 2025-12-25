import axios from 'axios'
const isDev = process.env.NODE_ENV === 'development'
const headers = isDev
  ? {
      'x-use-ppe': '1',
      'x-tt-env': 'ppe_6612519540'
    }
  : undefined
interface CarInfoRes {
  /** 品牌id */
  brand_id: number
  /** 车系id */
  series_id: number
  /** 车型id */
  car_id: number
  /** 车型名称 */
  name: string
  /** 外显名称 */
  display_name: string
  /** 年款 */
  year: number
  /** 之家id */
  autohome_id: number
}

interface CarInfoResponse {
  data: CarInfoRes
  status: string
  message: string
}

/**
 * vin码获取车款信息1v1精度匹配接口https://cloud.bytedance.net/bam/rd/motor.owner_price.go_mis/api_doc/show_doc?x-resource-account=public&x-bc-region-id=volc&version=1.0.8&cluster=default&endpoint_id=3765334
 * @param vin 车辆vin码
 * @returns
 */
export async function getCarInfo(vin: string): Promise<any> {
  try {
    const params = {
      vin_code: vin,
      match_source: 7,
      only_cache: isDev ? true : false // 测试时传true，正式使用时传false
    }
    const url = `${
      isDev ? '' : 'https://motor-admin.bytedance.net'
    }/motor/owner_price_mis/go_api/open_api/vin_info`
    const response = await axios.post<CarInfoResponse>(url, params, {
      headers
    })
    const { data, status } = response ?? {}
    if (status !== 200) {
      throw new Error('network status error')
    }
    const { data: resData, status: resSt, message } = data ?? {}
    if (resSt !== '0') {
      return { error: message }
      // throw new Error('response status error')
    }

    return resData
  } catch (error) {
    console.info(
      `Error fetching car info for vin: ${vin} ${(error as any).message}`
    )
  }
}
