import { Company, CompanyInfo, HotTags, JobSearchCondition, Position, PositionInfo } from '..';
import { FillJobQueryByDefault } from '../pages/list';
import { splitTitle } from '../utils';
import request from './axios';

export type JobCountSearchResponse = number;

export async function GetJobCount() {
  const res = await request.get('position/count');
  return res.data as number || 0;
}

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
    highlight: i.highlight,
    id: i.id,
    title: splitTitle(i.position?.title) || i.position?.title,
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
  title?: string;
  tags?: string[];
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
  const res = await request.post('company/search', {
    start: 0,
    limit: 10,
    title: '',
    tags: [],
    ...query,
  });
  const data = res.data as SearchCompanyResponseTmpData;
  return {
    total: data.total,
    companyList: data.companyList?.map(i => ({
      ...i.company,
      id: i.id,
      highlight: i.highlight
    }))
  };
}

export type GetCompanyRequest = {
  id?: string;
}

export type GetCompanyResponse = Company;

export async function GetCompanyDetail(query: GetCompanyRequest) {
  const res = await request.get('company', {
    params: {
      id: query.id
    }
  });
  const data = res.data as GetCompanyResponse;
  return data;
}

export type GetCompanyPositionsRequest = {
  id?: string;
  start?: number;
  limit?: number;
};

export type GetCompanyPositionsTmpResponse = {
  total?: number;
  positions?: PositionInfo[];
};

export async function GetCompanyPositions(query: GetCompanyPositionsRequest) {
  const res = await request.get('company/positions', {
    params: {
      id: query.id,
      start: query.start || 0,
      limit: query.limit || 10
    }
  });
  const data = res.data as GetCompanyPositionsTmpResponse;

  return {
    total: data.total,
    positions: data.positions?.map(i => ({
      ...i.position,
      id: i.id,
    }))
  };
}

export type RatePositionRequest = {
  id?: string;
  score?: number;
}

export async function RatePosition(query: RatePositionRequest) {
  const res = await request.post('position/rate', {
    ...query
  })
  return Promise.resolve();
}

export type SuggestRequest = {
  title?: string;
}

export type SuggestResponse = {
  id?: string;
  title?: string;
  views?: number;
}[];

export async function Suggest(query: SuggestRequest) {
  const res = await request.get('position/suggest', {
    params: {
      keyword: query.title || '',
    }
  });
  return res.data as SuggestResponse;
}

export type SuggestCompanyRequest = {
  name?: string;
}

export type SuggestCompanyResponse = CompanyInfo[];

export async function SuggestCompany(query: SuggestCompanyRequest) {
  const res = await request.get('company/suggest', {
    params: {
      name: query.name || '',
    }
  });
  const data = res.data as SuggestCompanyResponse;
  return data.map(i => ({
    ...i.company,
    id: i.id,
  })) as Company[];
}

export type HotTagsRequest = {
  limit?: number;
  threshold?: number;
}

export type HotTagsResponse = HotTags[];

export async function GetHotTags(query: HotTagsRequest) {
  const res = await request.get('position/hottags', {
    params: {
      limit: query.limit || 20,
      threshold: query.threshold || 100,
    }
  });
  const data: HotTagsResponse = res.data.map((i: { tagName: string, count: number }) => ({
    text: i.tagName,
    value: i.count,
  }));
  return data;
}