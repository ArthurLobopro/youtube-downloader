interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="border border-slate-500 p-1 rounded focus:border-blue-500"
    />
  );
}
