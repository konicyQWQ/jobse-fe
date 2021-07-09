import { Company, JobSearchCondition, Position, PositionInfo } from '..';
import { Degree, SortOrder } from '../type';
import request from './axios';

export type JobSearchRequest = JobSearchCondition & {
  sortOrder?: SortOrder;
  start: number;
  limit: number;
}

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