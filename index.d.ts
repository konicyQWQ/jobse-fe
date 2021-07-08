import * as Type from './type'

declare interface Range {
	GreaterThan?: number;
	GreaterThanOrEqualTo?: number;
	LessThan?: number;
	LessThanOrEqualTo?: number;
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
}

declare interface Position {
  title?: string;
  companyId?: string;
  updateTime?: Date;
  rating?: number;
  views?: number;
  salary?: Salary;
  requirement?: JobRequirement;
  description?: JobDescription;
}

declare interface Company {
  name?: string;
  iconUrl?: string;
  url?: string;
  location?: string;
  description?: string;
}