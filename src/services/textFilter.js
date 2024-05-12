function filterText(keydownEvent) {

    const acceptable = [
        // ... continue english alphabet
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        // ... continue russian alphabet
        'а',
        'б',
        'в',
        'г',
        'д',
        'е',
        // 'ё',
        'ж',
        'з',
        'и',
        'й',
        'к',
        'л',
        'м',
        'н',
        'о',
        'п',
        'р',
        'с',
        'т',
        'у',
        'ф',
        'х',
        'ц',
        'ч',
        'ш',
        'щ',
        'ъ',
        'ы',
        'ь',
        'э',
        'ю',
        'я',
        // ... also digits


        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        // ... also +,-,=,/,* signs
        '+',
        '-',
        '=',
        '/',
        '*',
        "\"",
        "\'",
        ":",
        " ",
        ",",
        "°",
        "³",
        "²",
        

        // ... special keys
        'Enter',
        'Backspace',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'End',
        'Home'
    ];

    const letters = [...acceptable.filter(char => ![

        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        // ... also +,-,=,/,* signs
        '+',
        '-',
        '=',
        '/',
        '*',
        "\"",
        "\'",
        ":",
        " ",
        ",",

        // ... special keys
        'Enter',
        'Backspace',

    ].includes(char)).map(char=>char.toUpperCase())];

    acceptable.push(...letters);

    const key = keydownEvent.key;
    if (acceptable.includes(key)) {
        return true;
    }
}

export { filterText }