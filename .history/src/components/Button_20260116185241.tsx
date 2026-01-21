type Props = {
    label: "Hãy nhấn vào đây";
    onlick: () => void;
    color: "black" | "red" | "green";
}

function Button({ label, onlick, color }: Props){
    return <button onClick={onlick} className={`bg-${color}-500 text-white px-4 py-2 rounded`}>{label}</button>;
}

export default Button;