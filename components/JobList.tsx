import styles from '../styles/JobList.module.css'
import JobListItem, { JobListItemProps } from './JobListItem';

type JobListProps = {
  data?: JobListItemProps[];
}

export default function JobList(props: JobListProps) {
  const { data } = props;

  return (
    <div className={styles['job-list-container']}>
      {data?.map(job => (
        <JobListItem {...job} key={job.title} />
      ))}
    </div>
  )
}