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

export function handleInputUpperCaseChangeBind(setState) {
    return (event) => {
        const input = event.target;
        const name = input.name;
        const start = input.selectionStart;
        const end = input.selectionEnd;

        setState({
            [name]: input.value.toUpperCase()
        }, () => {
            if (input.setSelectionRange) {
                input.setSelectionRange(start, end);
            }
        });
    };
}

export function getValueFormatted(value)  {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}