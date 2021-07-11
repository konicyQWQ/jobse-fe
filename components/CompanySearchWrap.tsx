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
        value={value?.name}
        onTextChange={(v) => onChange?.({...value, name: v})}
        onSearch={onSearch}
      />
    </div>
  )
}