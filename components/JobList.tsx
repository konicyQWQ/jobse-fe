import { Fade } from '@material-ui/core'
import styles from '../styles/JobList.module.css'
import MoodBadIcon from '@material-ui/icons/MoodBad';
import JobListItem, { JobListItemProps } from './JobListItem';

type JobListProps = {
  data?: JobListItemProps[];
  loading?: boolean;
}

export default function JobList(props: JobListProps) {
  const { data, loading } = props;

  return (
    <Fade in={!loading}>
      <div className={styles['job-list-container']}>
        {data?.map(job => (
          <JobListItem {...job} key={job.id} />
        ))}
        {(!data || data.length == 0) && (
          <div className={styles['empty-container']}>
            <MoodBadIcon className={styles['icon']} />
            <h2 className={styles['hint']}>抱歉，暂时没有相关信息</h2>
          </div>
        )}
      </div>
    </Fade>
  )
}