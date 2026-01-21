type Props = {
    label: string;
    onlick: () => void;
    color: "blue" | "red" | "green";
}

function Button(){
    return <button>Click Me!</button>;
}

export default Button;