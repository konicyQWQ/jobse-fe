import classNames from 'classnames';
import styles from '../styles/BlockSelect.module.css'

type BlockSelectProps<T extends any> = {
  label?: string;
  value?: T;
  onChange?: (v: T) => void;
  options?: { value: T, label: string }[];
  children?: React.ReactNode;
}

export default function BlockSelect<T>(props: BlockSelectProps<T>) {
  const { label, value, onChange, options, children } = props;

  return (
    <div className={styles['container']}>
      <div className={styles['label']}>
        {label}:
      </div>
      {options ? (
        <div className={styles['option-list']}>
          {options?.map(option => (
            <div
              key={JSON.stringify(option.value)}
              className={classNames(styles['option'], value == option.value && styles['active'])}
              onClick={() => onChange?.(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      ) : children}
    </div>
  )
}