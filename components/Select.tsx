import { useState } from 'react';
import styles from '../styles/Select.module.css'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'

type SelectProps<T> = {
  value?: T;
  onChange?: (v: T) => void;
  options?: { value: T, label: string }[];
}

export default function Select<T>(props: SelectProps<T>) {
  const { value, onChange, options } = props;

  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={styles['container']}>
        <div className={styles['option']} onClick={() => setOpen(open => !open)}>
          {options?.find(i => i.value == value)?.label}
        </div>
        <Grow in={open}>
          <div className={styles['option-list']}>
            {options?.map(i => (
              <div
                key={JSON.stringify(i.value)}
                className={styles['option']}
                onClick={() => {
                  setOpen(false);
                  onChange?.(i.value);
                }}
              >
                {i.label}
              </div>
            ))}
          </div>
        </Grow>
      </div>
    </ClickAwayListener>
  )
}