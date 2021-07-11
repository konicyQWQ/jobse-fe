import { Company } from '..'
import styles from '../styles/CompanyCard.module.css'
import Button from '@material-ui/core/Button'
import PageviewIcon from '@material-ui/icons/Pageview';
import Image from 'next/image'

type CompanyCardProps = {
  company?: Company;
}

export default function CompanyCard(props: CompanyCardProps) {
  const { company } = props;

  return (
    <div className={styles['card']}>
      <img
        className="icon"
        src={company?.iconUrl}
        alt={company?.name}
      />
      <div className={styles['title']}>{company?.name}</div>
      <div className={styles['description']}>
        {company?.description}
      </div>
      <div className={styles['divide-line']}></div>
      <Button className={styles['button']} size="large">
        <PageviewIcon />
        公司详情
      </Button>
    </div>
  )
}