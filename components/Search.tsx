import classNames from 'classnames';
import { HTMLAttributes } from 'react'
import styles from '../styles/Search.module.css'
import SearchIcon from '@material-ui/icons/Search'
import IconButton from '@material-ui/core/IconButton'
import Chip from '@material-ui/core/Chip'

type SerachProps = HTMLAttributes<HTMLDivElement> & {
  small?: boolean;
  value?: string;
  tags?: string[];
  onValueChange?: (v: [string[], string]) => void;
  onSearch?: () => void;
};

export default function Search(props: SerachProps) {
  const { className, value, tags = [], onValueChange, onSearch, small = false, ...other } = props;

  const handleDelete = (idx: number) => {
    tags?.splice(idx, 1);
    onValueChange?.([tags || [], value || '']);
  }

  return (
    <div
      className={classNames(styles['search-container'], className, small && styles['small'])}
      {...other}
    >
      <div className={styles['input-container']}>
        <div>
          {tags?.map((i, idx) => (
            <Chip size="small" onDelete={() => handleDelete(idx)} key={idx} label={i} />
          ))}
        </div>
        <input
          className={styles['input']}
          value={value}
          onChange={e => onValueChange?.([tags, e.target.value])}
          onKeyDown={(e) => {
            if (e.key == 'Enter' || e.keyCode == 13)
              onSearch?.();
            // 按下 tab 生成标签
            if (e.key == 'Tab') {
              const arr = value?.split(' ');
              const newTag = arr?.pop();
              if (newTag && /^\s*$/.test(newTag) == false) {
                onValueChange?.([tags?.concat(newTag) || [], arr?.join(' ') || ''])
              }
              e.preventDefault();
            }
          }}
          placeholder="输入职位，公司，关键词"
        />
      </div>
      <IconButton color="secondary" onClick={() => onSearch?.()}>
        <SearchIcon />
      </IconButton>
    </div>
  )
}