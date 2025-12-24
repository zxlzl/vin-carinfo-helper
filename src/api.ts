import axios from 'axios'

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
}


export async function getCarInfo(
  vin: string
): Promise<any> {
  try {
    const url = '/motor/owner_price_mis/go_api/vin_info'
    const response = await axios.get<CarInfoResponse>(url, {
      params: {
        vin,
        match_source: 7,
        only_cache: true
      }
      // headers: {
      //   'x-use-ppe': 1,
      //   'x-tt-env': 'ppe_invoice_info'
      // }
    })
    const { data,status} = response ?? {}
    if (status !== 200) {
      throw new Error('network status error')
    }
    const { data: resData, status: resSt } = data ?? {}
    
    if (resSt !== 'success') {
      throw new Error('response status error')
    }
    return resData
  } catch (error) {
    console.info(`Error fetching car info for vin: ${vin} ${(error as any).message}`)
  }
}
