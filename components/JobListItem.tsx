import { Company, Position } from "..";
import { DegreeLabel } from "../type";
import styles from '../styles/JobListItem.module.css'
import Link from 'next/link'
import Rating from '@material-ui/lab/Rating'
import { salary2text, TimeToNow2String } from "../utils";

export type JobListItemProps = Position & {
  company?: Company;
};

export default function JobListItem(props: JobListItemProps) {
  const { title, rating, requirement, salary, updateTime, views, company, id } = props;

  const star = rating ? rating / 2 : 0;

  return (
    <div className={styles['job-item-container']}>
      <div className={styles['avatar']}>
        <img
          className="icon"
          src={company?.iconUrl}
          alt={company?.name}
        />
      </div>
      <div className={styles['infomation']}>
        <Link
          href={{
            pathname: 'job',
            query: {
              id
            }
          }}
          passHref
        >
          <div className={styles['title']}>{title}</div>
        </Link>
        <div className={styles['requirement']}>
          <div>{requirement?.experience ? `${requirement.experience / 12} 年以上` : '不限经验'}</div>
          <div>{requirement?.degree ? `${DegreeLabel[requirement.degree]}以上` : '不限学历'}</div>
          <div>{salary2text(salary)}</div>
          <div>{requirement?.base?.join(', ')}</div>
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