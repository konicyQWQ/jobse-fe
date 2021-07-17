import Search from './Search'
import styles from '../styles/CompanySearchWrap.module.css'
import { CompanySearchCondition } from '..'

type SearchWrapProps = {
  value?: CompanySearchCondition;
  onChange?: (v: CompanySearchCondition) => void;
  onSearch?: () => void;
}

export default function SearchWrap(props: SearchWrapProps) {
  const { value, onChange, onSearch } = props;

  return (
    <div className={styles['container']}>
      <Search
        small
        tags={value?.tags}
        value={value?.title}
        onValueChange={([tags, v]) => onChange?.({...value, title: v, tags,})}
        onSearch={onSearch}
        placeholder={"输入公司名称"}
        company={true}
      />
    </div>
  )
}