import { Company } from "..";
import styles from '../styles/CompanyListItem.module.css'
import Link from 'next/link'
import Chip from '@material-ui/core/Chip'
import Image from '../components/Image'
import { useRouter } from "next/dist/client/router";

export type CompanyListItemProps = Company;

export default function CompanyListItem(props: CompanyListItemProps) {
  const { iconUrl, location, name, id, tags, highlight } = props;
  const router = useRouter();

  return (
    <div className={styles['company-item-container']}>
      <div className={styles['avatar']}>
        <Image
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
          <div
            className={styles['title']}
            dangerouslySetInnerHTML={{ __html: highlight?.titleHighlight || name || ''}}
          >
          </div>
        </Link>
        <div className={styles['location']}>
          <div>{location}</div>
        </div>
        <div className={styles['tags']}>
          {tags?.map(i => (
            <div
              key={i}
              onClick={() => {
                router.push({
                  pathname: 'clist',
                  query: {
                    tags: [i],
                  }
                })
              }}
            >
              <Chip
                size="small"
                clickable
                label={
                  <span dangerouslySetInnerHTML={{ __html: highlight?.tagsHighlight?.[i] || i }}>
                  </span>
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}