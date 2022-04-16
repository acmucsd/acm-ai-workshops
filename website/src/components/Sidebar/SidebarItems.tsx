import type { SidebarProps } from ".";
import SidebarItem from "./SidebarItem";

const SidebarItems = ({ items, ...props }: SidebarProps): JSX.Element => {
  return (
    <>
      {items.map((item, i) => (
        <SidebarItem
          key={i} // sidebar is static, the index does not change
          item={item}
          {...props}
        />
      ))}
    </>
  );
}

export default SidebarItems;