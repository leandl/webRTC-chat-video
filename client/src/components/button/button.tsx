import { ButtonHTMLAttributes } from "react";
import "./button.styles.scss"



export function Button({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const classNameButton = className ? `button ${className}` : "button"

  return <button className={classNameButton} {...rest} />
}