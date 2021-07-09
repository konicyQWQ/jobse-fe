import classNames from 'classnames';
import { HTMLAttributes, useState } from 'react'
import styles from '../styles/Search.module.css'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'

type SerachProps = HTMLAttributes<HTMLDivElement> & {
  small?: boolean;
  value?: string;
  onTextChange?: (v: string) => void;
  onSearch?: () => void;
};

export default function Search(props: SerachProps) {
  const { className, value, onTextChange, onSearch, small = false, ...other } = props;

  return (
    <div
      className={classNames(styles['search-container'], className, small && styles['small'])}
      {...other}
    >
      <input
        className={styles['input']}
        value={value}
        onChange={e => onTextChange?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key == 'Enter' || e.keyCode == 13)
            onSearch?.();
        }}
        placeholder="输入职位，公司，关键词"
      />
      <IconButton color="secondary" onClick={() => onSearch?.()}>
        <SearchIcon />
      </IconButton>
    </div>
  )
}