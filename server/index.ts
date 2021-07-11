import { Company, CompanyInfo, JobSearchCondition, Position, PositionInfo } from '..';
import { FillJobQueryByDefault } from '../pages/list';
import { Degree } from '../type';
import request from './axios';

export type JobSearchRequest = JobSearchCondition;

export type JobSearchResponse = {
  positionList?: {
    total?: number;
    positions?: PositionInfo[];
  },
  companies?: Record<string, Company>;
}

export async function SearchJob(query: JobSearchRequest) {
  const res = await request.post('position', FillJobQueryByDefault(query));
  const data = res.data as JobSearchResponse;

  const total = data.positionList?.total;
  const positions : Position[] = data.positionList?.positions?.map(i => ({
    ...i.position,
    title: i.position?.title?.split('#')[1] || i.position?.title,
    id: i.id,
    company: data.companies?.[i.position?.companyId || 0],
  })) || [];

  return {
    total,
    positions,
  };
}

export type GetJobDetailRequest = {
  id?: string;
}

export type GetJobDetailResponse = {
  position?: Position;
  company?: Company;
}

export async function GetJobDetail(query: GetJobDetailRequest) {
  const res = await request.get('position', {
    params: {
      id: query.id
    }
  });
  const data = res.data as GetJobDetailResponse;
  return data;
}

export type RelevantJobRequest = {
  title?: string;
  limit?: number;
  exclude?: string;
}

export type RelevantJobResponse = Position[];

export async function RelevantJobQuery(query: RelevantJobRequest) {
  const res = await request.post('position/Relevant', {
    query
  });
  const data = res.data as PositionInfo[];
  return data.map(i => ({ id: i.id, ...i.position})) as Position[];
}

export type SearchCompanyRequest = {
  name?: string;
  start?: number;
  limit?: number;
}

type SearchCompanyResponseTmpData = {
  total?: number;
  companyList?: CompanyInfo[];
}

export type SearchCompanyResponse = {
  total?: number;
  companyList?: Company[];
}

export async function SearchCompany(query: SearchCompanyRequest) {
  const res = await request.get('company/search', {
    params: {
      start: 0,
      limit: 10,
      name: '',
      ...query,
    }
  });
  const data = res.data as SearchCompanyResponseTmpData;
  return {
    total: data.total,
    companyList: data.companyList?.map(i => ({
      ...i.company,
      id: i.id,
    }))
  };
}