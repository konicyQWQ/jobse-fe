import classNames from 'classnames';
import { HTMLAttributes, useState } from 'react'
import styles from '../styles/Search.module.css'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'

type SerachProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
  onChange?: (v: string) => void;
  onSearch?: () => void;
};

export default function Search(props: SerachProps) {
  const { className, value, onChange, onSearch, ...other } = props;

  return (
    <div
      className={classNames(styles['search-container'], className)}
      {...other}
    >
      <input
        className={styles['input']}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter' || e.keyCode == 13)
            onSearch?.();
        }}
        placeholder=".net 开发工程师"
      />
      <IconButton color="secondary" onClick={() => onSearch?.()}>
        <SearchIcon />
      </IconButton>
    </div>
  )
}