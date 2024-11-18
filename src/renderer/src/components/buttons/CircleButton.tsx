/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";

interface CircleButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  small?: boolean;
  useDiv?: boolean;
  className?: string;
}

export const CircleButton = forwardRef(function CircleButton(
  props: CircleButtonProps,
  ref,
) {
  const Component = props.useDiv
    ? (props: any) => <div {...props} ref={ref} />
    : (props: any) => <button {...props} ref={ref} />;

  return (
    <Component
      className={[
        "size-[24px] grid place-items-center cursor-pointer",
        "border-current border-2 rounded-full",
        `${props.small ? "small" : ""}`,
        props.className || "",
      ].join(" ")}
      onClick={props.onClick}
      title={props.title}
      tabIndex={props.useDiv ? undefined : -1}
    >
      {props.children}
    </Component>
  );
});
