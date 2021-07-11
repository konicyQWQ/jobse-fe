import { Company } from "..";
import styles from '../styles/CompanyListItem.module.css'
import Link from 'next/link'
import Chip from '@material-ui/core/Chip'

export type CompanyListItemProps = Company;

export default function CompanyListItem(props: CompanyListItemProps) {
  const { iconUrl, location, name, id, tags } = props;

  return (
    <div className={styles['company-item-container']}>
      <div className={styles['avatar']}>
        <img
          className="icon"
          src={iconUrl}
          alt={name}
        />
      </div>
      <div className={styles['infomation']}>
        <Link
          href={{
            pathname: 'company',
            query: {
              id
            }
          }}
          passHref
        >
          <div className={styles['title']}>{name}</div>
        </Link>
        <div className={styles['location']}>
          <div>{location}</div>
        </div>
        <div className={styles['tags']}>
          {tags?.map(i => (
            <Chip size="small" clickable label={i} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}