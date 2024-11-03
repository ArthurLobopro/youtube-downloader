
interface ButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export function Button(props: ButtonProps) {
    return (
        <button {...props}
            className={["w-max px-1 py-[2px] text-sm rounded bg-slate-700 text-neutral-200", props.className].join(" ")} />
    )
}