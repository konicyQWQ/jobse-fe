import { Company, Position } from "..";
import { DegreeLabel } from "../type";
import styles from '../styles/JobListItem.module.css'
import Image from 'next/image'
import Rating from '@material-ui/lab/Rating'
import { TimeToNow2String } from "../utils";

export type JobListItemProps = Position & {
  company?: Company;
};

export default function JobListItem(props: JobListItemProps) {
  const { title, rating, requirement, salary, updateTime, views, company } = props;

  const star = rating ? rating / 2 : 0;

  return (
    <div className={styles['job-item-container']}>
      <div className={styles['avatar']}>
        {/* <Image
          src={{
            src: company?.iconUrl || '',
            height: 80,
            width: 80,
          }}
          alt={company?.name}
        /> */}
      </div>
      <div className={styles['infomation']}>
        <div className={styles['title']}>{title}</div>
        <div className={styles['requirement']}>
          <div>{requirement?.experience ? `${requirement.experience / 12} 年以上` : '不限经验'}</div>
          <div>{requirement?.degree ? `${DegreeLabel[requirement.degree]}以上` : '不限学历'}</div>
          <div>{salary?.provided 
            ?  `${Math.floor((salary.amount?.greaterThanOrEqualTo || 0) / 1000)}K ~ ${Math.floor((salary.amount?.lessThanOrEqualTo || 0) / 1000)}K` 
            : '面议'}
          </div>
        </div>
        <div className={styles['company']}>{company?.name}</div>
        <div className={styles['views']}>{views} 次浏览</div>
        <div className={styles['right-extra']}>
          <Rating value={star} readOnly precision={0.1} />
          <div>{TimeToNow2String(new Date(updateTime || new Date().getTime()))}更新</div>
        </div>
      </div>
    </div>
  )
}

/**
 * <JobListItem
    title="前端工程师"
    requirement={{
      base: ['杭州', '上海'],
      degree: Degree.Master,
      experience: 12
    }}
    salary={{
      provided: true,
      amount: {
        GreaterThan: 1,
        LessThan: 4
      }
    }}
    rating={7.2}
    views={3366}
    updateTime={new Date('2021.7.6')}
    company={{
      iconUrl: 'http://pic1.jobui.com/companyLogo/10375749/16045652779687.jpg!msq',
      name: '杭州鸿雁电器有限公司',
    }}
  />
 */