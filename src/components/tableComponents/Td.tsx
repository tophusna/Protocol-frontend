import { IPropsOfComponent } from "../../utils/interfaces";

export default function Td({ className = '', children, ...others }: IPropsOfComponent) {
  return (
    <td className={`text-gray-100 px-4 py-4 ${className}`} {...others}>
      {children}
    </td>
  )
}