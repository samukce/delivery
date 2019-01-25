export function handleInputChangeBind(setState) {
    return (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setState({
            [name]: value
        });
    };
}

export function getValueFormatted(value)  {
    return `$${value.toLocaleString('en', { minimumFractionDigits: 2 })}`;
}