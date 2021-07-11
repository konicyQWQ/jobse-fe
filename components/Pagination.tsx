import styles from '../styles/Pagination.module.css'
import Button from '@material-ui/core/Button'
import classNames from 'classnames';

type PaginationProps = {
  start?: number;
  limit?: number;
  total?: number;
  onChange?: (v: {
    start: number;
    limit: number;
  }) => void;
}

export default function Pagination(props: PaginationProps) {
  const { start = 0, limit = 10, total = 10, onChange } = props;

  const nowPage = start / limit + 1;
  const totalPage = Math.ceil(total / limit);
  let pageList;
  if (nowPage <= 3)
    pageList = [1, 2, 3, 4, 5].filter(i => i <= totalPage);
  else if (nowPage >= totalPage - 2)
    pageList = [4, 3, 2, 1, 0].map(i => totalPage - i).filter(i => i >= 1);
  else
    pageList = [-2, -1, 0, 1, 2].map(i => nowPage + i).filter(i => i >= 1 && i <= totalPage);
  if (!pageList.find(i => i == 1)) {
    pageList.unshift(-1);    
    pageList.unshift(1);
  }
  if (!pageList.find(i => i == totalPage)) {
    pageList.push(-2);
    pageList.push(totalPage)
  }

  return (
    totalPage != 0 ? (
      <div className={styles['pagination']}>
        {pageList.map(i => (
          <div
            className={classNames(styles['page'], i == nowPage && styles['active'], i < 0 && styles['eli'])}
            key={i}
            onClick={() => {
              if (i > 0) {
                onChange?.({
                  limit,
                  start: limit * (i - 1),
                })
              }
            }}
          >
            {i < 0 ? '...' : i}
          </div>
        ))}
        共 {totalPage} 页
      </div>
    ) : <div></div>
  )
}