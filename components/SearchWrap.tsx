import Search from './Search'
import BlockSelect from './BlockSelect'
import styles from '../styles/SearchWrap.module.css'
import Slider from '@material-ui/core/Slider'
import { Degree } from '../type'
import Select from './Select'
import { JobSearchCondition } from '..'
import { City, Province } from '../utils/province'

type SearchWrapProps = {
  value?: JobSearchCondition;
  onChange?: (v: JobSearchCondition) => void;
  onSearch?: () => void;
}


export default function SearchWrap(props: SearchWrapProps) {
  const { value, onChange, onSearch } = props;

  const base = (value?.base as string) || "全部"
  const provinceID = City.find(i => i.name == base)?.ProID;
  const provinceName = Province.find(i => i.ProID == provinceID)?.name;
  const cityArr = City.filter(i => i.ProID == provinceID);

  return (
    <div className={styles['container']}>
      <Search
        small
        value={value?.title}
        tags={value?.tags}
        onValueChange={([tags, text]) => {
          onChange?.({
            ...value,
            title: text,
            tags,
          })
        }}
        onSearch={onSearch}
      />
      <div className={styles['extra-condition']}>
        <BlockSelect<number>
          label="工作经验"
          value={value?.experience}
          onChange={(v) => onChange?.({...value, experience: v})}
          options={[
            {
              value: -1,
              label: '不限经验'
            },
            {
              value: 0,
              label: '应届'
            },
            {
              value: 12,
              label: '1年以上'
            },
            {
              value: 36,
              label: '3年以上'
            },
            {
              value: 60,
              label: '5年以上'
            },
          ]}
        />
        <BlockSelect<Degree>
          label="您的学历"
          value={value?.degree}
          onChange={(v) => onChange?.({...value, degree: v})}
          options={[
            {
              value: Degree.None,
              label: '不限',
            },
            {
              value: Degree.JuniorCollege,
              label: '大专',
            },
            {
              value: Degree.Bachelor,
              label: '本科',
            },
            {
              value: Degree.Master,
              label: '硕士',
            },
            {
              value: Degree.Doctor,
              label: '博士',
            },
          ]}
        />
        <BlockSelect label="工作地点">
          <Select
            value={provinceName}
            options={Province.map(i => ({ value: i.name, label: i.name }))}
            onChange={(province) => {
              const newProvince = Province.find(i => i.name == province)?.ProID;
              onChange?.({
                ...value,
                base: City.filter(i => newProvince == i.ProID)[0].name
            })
            }}
          />
          <Select
            value={base}
            options={cityArr.map(i => ({ value: i.name, label: i.name }))}
            onChange={(city) => {
              onChange?.({
                ...value,
                base: city,
              })
            }}
          />
        </BlockSelect>
        <BlockSelect label="薪资待遇">
          <Slider
            style={{ width: 600 }}
            valueLabelDisplay='auto'
            defaultValue={3}
            min={0}
            max={70}
            step={1}
            value={parseInt(value?.salary as unknown as string) / 1000}
            onChange={(_, v) => onChange?.({...value, salary: v as number * 1000})}
            marks={[
              { value: 3, label: '3K' },
              { value: 6, label: '6K' },
              { value: 10, label: '10K' },
              { value: 20, label: '20K' },
              { value: 50, label: '50K(月薪)' },
            ]}
          />
        </BlockSelect>
      </div>
    </div>
  )
}