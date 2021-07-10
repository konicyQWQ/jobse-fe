import { Company, JobSearchCondition, Position, PositionInfo } from '..';
import { Degree, SortOrder } from '../type';
import request from './axios';

export type JobSearchRequest = JobSearchCondition;

export type JobSearchResponse = {
  positionList?: {
    total?: number;
    positions?: PositionInfo[];
  },
  companies?: Record<string, Company>;
}

export const defaultSearchCondition: JobSearchCondition = {
  experience: -1,
  degree: Degree.None,
  salary: 0,
  title: '',
  start: 0,
  limit: 10,
}

export async function SearchJob(query: JobSearchRequest) {
  const res = await request.post('position', {
    ...defaultSearchCondition,
    ...query,
    base: query.base == '全部' ? '' : query.base
  } as JobSearchRequest);
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