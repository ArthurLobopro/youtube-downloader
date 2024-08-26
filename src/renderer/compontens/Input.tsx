interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> { }

export function Input(props: InputProps) {
    return <input {...props} className="border border-slate-500 px-1" />
}