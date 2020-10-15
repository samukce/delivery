export function handleInputChangeBind(setState, callback) {
    return (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setState({
            [name]: value
        }, callback);
    };
}

export function getValueFormatted(value)  {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}