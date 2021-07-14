import classNames from 'classnames';
import styles from '../styles/BlockSelect.module.css'

type BlockSelectProps<T extends any> = {
  label?: string;
  value?: T;
  values?: T[];
  onChange?: (v: T) => void;
  onValuesChange?: (v: T[]) => void;
  options?: { value: T, label: React.ReactNode }[];
  children?: React.ReactNode;
}

export default function BlockSelect<T>(props: BlockSelectProps<T>) {
  const { label, value, onChange, options, children, values, onValuesChange } = props;

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
              className={classNames(styles['option'], (values ? values.find(i => i == option.value) : value == option.value) && styles['active'])}
              onClick={() => {
                if (values) {
                  const idx = values.findIndex(i => i == option.value);
                  let newValues = values;
                  if (idx != -1) {
                    newValues.splice(idx, 1);
                  } else {
                    newValues.push(option.value);
                  }
                  onValuesChange?.(newValues);
                } else {
                  onChange?.(option.value)
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      ) : children}
    </div>
  )
}