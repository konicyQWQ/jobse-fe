export enum Degree {
  None,	//不限
  JuniorCollege,	//大专
  Bachelor,	//本科（学士）
  Master,	//研究生（硕士）
  Doctor,	//研究生（博士）
}

export const DegreeLabel: Record<Degree, string> = {
  [Degree.None]: '不限学历',
  [Degree.JuniorCollege]: '大专',
  [Degree.Bachelor]: '本科',
  [Degree.Master]: '硕士',
  [Degree.Doctor]: '博士',
}