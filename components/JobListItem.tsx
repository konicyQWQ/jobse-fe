import { Company, Position } from "..";
import { DegreeLabel } from "../type";
import styles from '../styles/JobListItem.module.css'
import Link from 'next/link'
import Rating from '@material-ui/lab/Rating'
import { salary2text, TimeToNow2String } from "../utils";
import Image from "./Image";
import { Chip } from "@material-ui/core";
import { useRouter } from "next/router";

export type JobListItemProps = Position & {
  company?: Company;
};

export default function JobListItem(props: JobListItemProps) {
  const { title, rating, requirement, salary, updateTime, views, company, id, companyId, description, highlight } = props;

  const star = rating ? rating / 2 : 0;
  const router = useRouter();

  return (
    <div className={styles['job-item-container']}>
      <div className={styles['avatar']}>
        <Image
          className="icon"
          src={company?.iconUrl}
          alt={company?.name}
        />
      </div>
      <div className={styles['information']}>
        <Link
          href={{
            pathname: 'job',
            query: {
              id
            }
          }}
          passHref
        >
          <div className={styles['title']}>
            <div
              className={styles['text']}
              dangerouslySetInnerHTML={{ __html: highlight?.titleHighlight?.split('#')[1] || title || ''}}
            >
            </div>
            <div className={styles['tags']}>
              {description?.tags?.map((i, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    router.push({
                      pathname: 'list',
                      query: {
                        tags: [i],
                      }
                    })
                  }}
                >
                  <Chip
                    size="small"
                    label={
                      <span dangerouslySetInnerHTML={{ __html: highlight?.tagsHighlight?.[i] || i}}>
                      </span>
                    }
                    clickable
                    style={{
                      borderRadius: 0,
                      fontSize: 12,
                      fontWeight: 400,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Link>
        <div className={styles['requirement']}>
          <div>{requirement?.experience ? `${requirement.experience / 12} 年以上` : '应届生'}</div>
          <div>{requirement?.degree ? `${DegreeLabel[requirement.degree]}以上` : '不限学历'}</div>
          <div>{salary2text(salary)}</div>
          <div>{requirement?.base?.join(', ')}</div>
        </div>
        <Link passHref href={{ pathname: 'company', query: { id: companyId } }}>
          <div
            className={styles['company']}
            dangerouslySetInnerHTML={{ __html: highlight?.titleHighlight?.split('#')[0] || company?.name || ''}}
          >
          </div>
        </Link>
        <div className={styles['views']}>{views} 次浏览</div>
        <div className={styles['right-extra']}>
          <Rating value={star} readOnly precision={0.1} />
          <div>{TimeToNow2String(new Date(updateTime || new Date().getTime()))}更新</div>
        </div>
      </div>
    </div>
  )
}