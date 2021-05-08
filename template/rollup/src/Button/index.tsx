import React, { ReactNode } from 'react'
import './style/index.less'

export interface ButtonProps {
  children: ReactNode
  onClick: Function,
}

const Button = (props: ButtonProps) => {
  const { children, onClick } = props
  const handleClick = () => {
    onClick && onClick()
  }
  
  return (
    <div className="button" onClick={handleClick}>
      {children}
    </div>
  )
}

export default Button
