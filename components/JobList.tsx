import { Fade } from '@material-ui/core'
import styles from '../styles/JobList.module.css'
import Empty from './Empty';
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
          <Empty />
        )}
      </div>
    </Fade>
  )
}