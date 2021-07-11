import { Position } from "..";
import styles from '../styles/RelevantJobList.module.css'
import CircularProgress from '@material-ui/core/CircularProgress'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import Link from 'next/link'
import { salary2text } from "../utils";
import Empty from './Empty';

type RelevantJobListProps = {
  positions?: Position[];
  loading?: boolean;
  onClickMore?: () => void;
};

export default function RelevantJobList(props: RelevantJobListProps) {
  const { positions, loading, onClickMore } = props;

  return (
    <div className={styles['card']}>
      <div className={styles['title']}>
        相关职位
      </div>
      <div className={styles['list-container']}>
        {loading && <CircularProgress color="secondary" />}
        <Fade in={!loading}>
          <div className={styles['list']}>
            {positions?.map(position => (
              <div className={styles['item']} key={position.id}>
                <Link
                  passHref
                  href={{
                    pathname: 'job',
                    query: {
                      id: position.id
                    }
                  }}
                >
                  <div className={styles['job-title']}>
                    {position.title?.split('#')[1] || position.title}
                  </div>
                </Link>
                <div className={styles['company']}>
                  {position.title?.split('#')[0] || position.title}
                </div>
                <div className={styles['bottom']}>
                  <div className={styles['salary']}>
                    {salary2text(position.salary)}
                  </div>
                  <div className={styles['base']}>
                    {position.requirement?.base?.join(',')}
                  </div>
                </div>
              </div>
            ))}
            {(!positions || positions.length == 0) && <Empty size="small" />}
          </div>
        </Fade>
      </div>
      {positions && positions.length > 5 && (
        <div className={styles['more']}>
          <Button
            className={styles['button']}
            size="large"
            onClick={onClickMore}
          >
            <MoreHorizIcon />
            查看更多
          </Button>
        </div>
      )}
    </div>
  )
}