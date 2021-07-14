import classNames from 'classnames';
import styles from '../styles/Search.module.css'
import SearchIcon from '@material-ui/icons/Search'
import { Chip, Fade, IconButton } from '@material-ui/core'
import { debounce } from 'lodash';
import { Suggest, SuggestResponse } from '../server';
import { useState, useRef, useEffect, HTMLAttributes } from 'react';
import { useRouter } from 'next/router'

type SerachProps = HTMLAttributes<HTMLDivElement> & {
  small?: boolean;
  value?: string;
  tags?: string[];
  onValueChange?: (v: [string[], string]) => void;
  onSearch?: () => void;
};

export default function Search(props: SerachProps) {
  const { className, value, tags = [], onValueChange, onSearch, small = false, ...other } = props;
  const router = useRouter();

  const handleDelete = (idx: number) => {
    tags?.splice(idx, 1);
    onValueChange?.([tags || [], value || '']);
  }

  const [list, setList] = useState<SuggestResponse>([]);
  const getSuggestWord = useRef(debounce(async (title?: string) => {
    if (title) {
      try {
        const list = await Suggest({ title });
        setList(list);
      } catch (e) {
        setList([{
          title: '字节跳动#前端工程师',
          views: 100,
        }])
      }
    }
  }, 300)).current;

  useEffect(() => {
    getSuggestWord(value);
    setActiveIdx(-1);
  }, [getSuggestWord, value])

  const [activeIdx, setActiveIdx] = useState(-1);
  const [focus, setFocus] = useState(false);

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
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={e => onValueChange?.([tags, e.target.value])}
          placeholder="输入职位，公司，关键词，输入任意词语按下tab生成标签"
          onKeyDown={(e) => {
            if (e.key == 'Enter') {
              if (activeIdx != -1) {
                router.push({
                  pathname: 'job',
                  query: {
                    id: list[activeIdx].id
                  }
                })
              } else {
                onSearch?.();
              }
            }
            // 按下 tab 生成标签
            if (e.key == 'Tab') {
              const arr = value?.split(' ');
              const newTag = arr?.pop();
              if (newTag && /^\s*$/.test(newTag) == false && tags.length <= 3) {
                onValueChange?.([tags?.concat(newTag) || [], arr?.join(' ') || ''])
              }
              e.preventDefault();
            }
            // 按下上下按键选择提示项
            if (e.key == 'ArrowUp') {
              setActiveIdx(i => Math.max(i - 1, 0));
              e.preventDefault();
            }
            if (e.key == 'ArrowDown') {
              setActiveIdx(i => Math.min(i + 1, list.length - 1))
            }
          }}
        />
      </div>
      <IconButton color="secondary" onClick={() => onSearch?.()}>
        <SearchIcon />
      </IconButton>
      <Fade in={focus}>
        <div className={styles['suggest']}>
          {list.map((i, idx) => (
            <div
              key={i.title}
              className={classNames(styles['suggest-item'], activeIdx == idx && styles['active'])}
              onClick={() => {
                router.push({
                  pathname: 'job',
                  query: {
                    id: i.id
                  }
                })
              }}
            >
              <div className={styles['title']}>
                {i.title?.split('#')[1]}
              </div>
              <div className={styles['extra']}>
                <div className={styles['company']}>
                  {i.title?.split('#')[0]}
                </div>
                <div className={styles['views']}>
                  {i.views} 次浏览
                </div>
              </div>
            </div>
          ))}
        </div>
      </Fade>
    </div>
  )
}