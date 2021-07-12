import { Position, Salary } from "..";
import qs from 'qs';

const minute = 1000 * 60;
const hour = 60 * minute;
const day = 24 * hour;

export function TimeToNow2String(time: Date) : string {
  const now = new Date().getTime();
  const diff = now - time.getTime();

  const diffMinute = diff / minute;
  if (diffMinute < 60)
    return `${Math.floor(diffMinute)} 分钟前`;

  const diffHour = diff / hour;
  if (diffHour < 24)
    return `${Math.floor(diffHour)} 小时前`;

  const diffDay = diff / day;
  if (diffDay < 30)
    return `${Math.floor(diffDay)} 天前`;

  return time.toLocaleDateString();
}

export function salary2text(salary?: Salary) : string {
  return salary?.provided 
  ?  `${Math.floor((salary.amount?.greaterThanOrEqualTo || 0) / 1000)}K ~ ${Math.floor((salary.amount?.lessThanOrEqualTo || 0) / 1000)}K / 月` 
  : '面议'
}

export function getHrefQuery() {
  const url = window.location.search;

  return qs.parse(url);
}

export function calcTagsArray(list: Position[]) {
  const tags = {} as Record<string, number>;
  list.forEach(i => {
    i.description?.tags?.forEach(i => tags[i] ? tags[i]++ : tags[i] = 1);
  });

  let arr = [] as { text: string; value: number }[];
  for(let key in tags) {
    arr.push({
      text: key,
      value: tags[key]
    })
  }
  return arr;
}