import ApiCommonParams from './ApiCommonParams'

export interface AllSchoolApiParams extends ApiCommonParams {
}

export interface AllSchoolApiData {
  school: { [schoolName: string]: string[] }
}
