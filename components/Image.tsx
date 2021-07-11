import { ImgHTMLAttributes } from 'react'

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;

export default function Image(props: ImageProps) {
  const { src, alt, ...others } = props;

  return (
    <img
      {...others}
      src={(src == 'None' || !src) ? '/company.jpeg' : src}
      alt={props.alt || ''}
    />
  )
}