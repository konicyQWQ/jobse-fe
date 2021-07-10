import styles from '../styles/Empty.module.css'
import MoodBadIcon from '@material-ui/icons/MoodBad';
import classNames from 'classnames';

type EmptyProps = {
  size?: string;
}

export default function Empty(props: EmptyProps) {
  const { size } = props;

  return (
    <div className={classNames(styles['empty-container'], size == 'small' && styles['small'])}>
      <MoodBadIcon className={styles['icon']} />
      <h2 className={styles['hint']}>抱歉，暂时没有相关信息</h2>
    </div>
  )
}