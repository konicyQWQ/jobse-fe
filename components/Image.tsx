import { useState } from 'react';
import { ImgHTMLAttributes } from 'react'

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function Image(props: ImageProps) {
  const { src, alt, ...others } = props;

  const [err, setErr] = useState(false);


  return (
    <img
      {...others}
      src={(src == 'None' || !src || err) ? '/company.jpeg' : src}
      onError={() => {
        setErr(true)
      }}
      onLoad={() => {
      }}
      alt={props.alt || ''}
    />
  )
}