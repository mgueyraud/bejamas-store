import { cn } from "@/lib/utils";
import { ComponentProps, ElementType } from "react";

type Props<E extends ElementType> = Omit<ComponentProps<E>, "as"> & {
  as?: E;
};

const Button = <E extends ElementType = "button">({
  as,
  className = "",
  ...props
}: Props<E>) => {
  const TagName = as || "button";

  return (
    <TagName
      {...props}
      className={cn(
        "cursor-pointer bg-accent text-black font-bold px-6 h-12 rounded-full",
        className
      )}
    />
  );
};

export default Button;
