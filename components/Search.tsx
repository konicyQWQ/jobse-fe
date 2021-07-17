import classNames from 'classnames';
import styles from '../styles/Search.module.css'
import SearchIcon from '@material-ui/icons/Search'
import { Chip, Fade, IconButton } from '@material-ui/core'
import { debounce } from 'lodash';
import { Suggest, SuggestCompany, SuggestCompanyResponse, SuggestResponse } from '../server';
import { useState, useRef, useEffect, HTMLAttributes } from 'react';
import { useRouter } from 'next/router'
import { splitTitle } from '../utils';
import { Company } from '..';
import Image from './Image';

type SerachProps = HTMLAttributes<HTMLDivElement> & {
  small?: boolean;
  value?: string;
  tags?: string[];
  onValueChange?: (v: [string[], string]) => void;
  onSearch?: () => void;
  placeholder?: string;
  company?: boolean;
};

export default function Search(props: SerachProps) {
  const { className, value, tags = [], company, onValueChange, onSearch, small = false, placeholder, ...other } = props;
  const router = useRouter();

  const handleDelete = (idx: number) => {
    tags?.splice(idx, 1);
    onValueChange?.([tags || [], value || '']);
  }

  const [list, setList] = useState<SuggestResponse>([]);
  const [companyList, setCompanyList] = useState<Company[]>([]);

  const getSuggestWord = useRef(debounce(async (title?: string) => {
    if (title) {
      try {
        if (company) {
          const company = await SuggestCompany({ name: title });
          setCompanyList(company)
        } else {
          const list = await Suggest({ title });
          setList(list);
        }
      } catch (e) {
        setList([])
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
          maxLength={50}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={e => onValueChange?.([tags, e.target.value])}
          placeholder={placeholder || "输入职位，公司，关键词，输入任意词语按下tab生成标签"}
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
                setFocus(false);
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
          {company && companyList.map((i, idx) => (
            <div
              key={i.id}
              className={classNames(styles['suggest-item'], activeIdx == idx && styles['active'], styles['company'])}
              onClick={() => {
                router.push({
                  pathname: 'company',
                  query: {
                    id: i.id
                  }
                })
              }}
            >
              <Image
                src={i.iconUrl}
                width={50}
                height={50}
                alt={i.name}
              />
              <div className={styles['text']}>
                <div className={styles['title']}>
                  {i.name}
                </div>
                <div className={styles['extra']}>
                  <div className={styles['company']}>
                    {i.location}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!company && list.map((i, idx) => (
            <div
              key={i.id}
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
                {splitTitle(i.title)}
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