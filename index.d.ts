import * as Type from './type'

declare interface Range {
	greaterThan?: number;
	greaterThanOrEqualTo?: number;
	lessThan?: number;
	lessThanOrEqualTo?: number;
}

declare interface Salary {
  provided?: boolean;
  amount?: Range;
}

declare interface JobRequirement {
  experience?: number;
  degree?: Type.Degree;
  base?: string[];
}

declare interface JobDescription {
  url?: string;
  description?: string;
  tags?: string[];
}

declare interface Position {
  id?: string;
  title?: string;
  companyId?: string;
  updateTime?: number;
  rating?: number;
  views?: number;
  salary?: Salary;
  requirement?: JobRequirement;
  description?: JobDescription;
  company?: Company;
}

declare interface PositionInfo {
  id?: string;
  position?: Position;
}

declare interface CompanyInfo {
  id?: string;
  company?: Company;
}

declare interface Company {
  name?: string;
  iconUrl?: string;
  id?: string;
  location?: string;
  description?: string;
  tags?: string[];
}

declare interface JobSearchCondition {
  title?: string;
  base?: string[] | string;
  degree?: Degree;
  salary?: number;
  experience?: number;
  sortOrder?: SortOrder;
  start?: number;
  limit?: number;
  tags?: string[];
}

declare interface CompanySearchCondition {
  name?: string;
}