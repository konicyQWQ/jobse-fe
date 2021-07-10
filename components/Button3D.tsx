import classNames from 'classnames';
import { useRef } from 'react';
import { useEffect } from 'react';
import { HTMLAttributes } from 'react';
import styles from '../styles/Button3D.module.css'

type Button3DProps = HTMLAttributes<HTMLAnchorElement> & {
  text: string;
};

export default function Button3D(props: Button3DProps) {
  const { children, text, ...others } = props;
  const el = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (el.current) {
      const ael = el.current;
      const docStyle = document.documentElement.style
      const boundingClientRect = ael.getBoundingClientRect()
  
      ael.onmousemove = function(e) {
        const x = e.clientX - boundingClientRect.left
        const y = e.clientY - boundingClientRect.top
        const xc = boundingClientRect.width/2
        const yc = boundingClientRect.height/2
        const dx = x - xc
        const dy = y - yc
        docStyle.setProperty('--rx', `${ dy/-1 }deg`)
        docStyle.setProperty('--ry', `${ dx/10 }deg`)
      }
  
      ael.onmouseleave = function(e) {
        docStyle.setProperty('--ty', '0')
        docStyle.setProperty('--rx', '0')
        docStyle.setProperty('--ry', '0')
      }
  
      ael.onmousedown = function(e) {
        docStyle.setProperty('--tz', '-25px')
      }
  
      document.body.onmouseup = function(e) {
        docStyle.setProperty('--tz', '-12px')
      }

      return () => {
        document.body.onmouseup = null;
        if (ael) {
          ael.onmouseleave = null;
          ael.onmousedown = null;
          ael.onmousemove = null;
        }
      }
    }
  }, [])

  return (
    <a ref={el} {...others} className={classNames(props.className, styles['button'])} data-title={text} />
  )
}