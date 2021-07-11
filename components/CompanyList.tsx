import { Fade } from '@material-ui/core'
import styles from '../styles/CompanyList.module.css'
import Empty from './Empty';
import CompanyListItem, { CompanyListItemProps } from './CompanyListItem'

type JobListProps = {
  data?: CompanyListItemProps[];
  loading?: boolean;
}

export default function CompanyList(props: JobListProps) {
  const { data, loading } = props;

  return (
    <Fade in={!loading}>
      <div className={styles['company-list-container']}>
        {data?.map(company => (
          <CompanyListItem {...company} key={company.id} />
        ))}
        {(!data || data.length == 0) && (
          <Empty />
        )}
      </div>
    </Fade>
  )
}