import axios from 'axios'

interface CarInfoRes {

}

interface CarInfoResponse {
  data: CarInfoRes
  status: string
}


export async function getCarInfo(
  vin: string
): Promise<any> {
  try {
    const url = '/motor/owner_price_mis/api/open_vin_info'
    const response = await axios.get<CarInfoResponse>(url, {
      params: {
        vin
      },
      headers: {
        'x-use-ppe': 1,
        'x-tt-env': 'ppe_invoice_info'
        // 可选：接口需要的鉴权头（如 token）
        // 'Authorization': 'Bearer your-token-here',
      }
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
