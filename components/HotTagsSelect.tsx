import { useEffect, useState } from 'react';
import { HotTags } from '..';
import { GetHotTags } from '../server';
import { BlockSelect } from './index'

type HotTagsSelectProps = {
  value?: string[];
  onChange?: (e: string[]) => void;
}

export default function HotTagsSelect(props: HotTagsSelectProps) {
  const { value, onChange } = props;
  const [hotTags, setHotTags] = useState<HotTags[]>([]);
  const getHotTags = async () => {
    try {
      const data = await GetHotTags({ limit: 6 });
      setHotTags(data);
    } catch (e) {}
  }

  useEffect(() => {
    getHotTags();
  }, [])

  return (
    <BlockSelect
      values={value}
      onValuesChange={onChange}
      label="热门标签"
      options={hotTags.map(i => ({
        label: i.text || '',
        value: i.text || '',
      }))}
    />
  )
}