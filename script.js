// DOM ELEMENTS;
let resultEl = document.querySelector('#result')
let lengthEl = document.querySelector('#length')
let uppercaseEl = document.querySelector('#uppercase')
let lowercaseEl = document.querySelector('#lowercase')
let numbersEl = document.querySelector('#numbers')
let symbolsEl = document.querySelector('#symbols')
const generateBtn = document.querySelector('#generate')
const clipboardEl = document.querySelector('#clipboard')
const searchEl = document.querySelector('#search')
const validateEl = document.querySelector('#validate')
const tableBodyEl = document.querySelector('#tbody');
const tableContainerEl = document.querySelector('#table-container');
const infoColumnEl = document.querySelector('#info-column');
const deletebtn = document.querySelector('#delete');

const randomFunction = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
}

// LOAD TABLE DATA
function loadTableData(){
    const tickets = JSON.parse(localStorage.getItem('tickets'));

    if(!tickets){
        tableContainerEl.classList.add('d-none')
        const alertEl = document.createElement('div');
        alertEl.classList.add('alert');
        alertEl.classList.add('alert-danger');
        alertEl.setAttribute('role', 'alert')
        alertEl.innerText = 'You have no tickets. Generate some tickets and see Ticketeer in action.';
        infoColumnEl.appendChild(alertEl);
        return;
    }
    else{
        tableContainerEl.classList.remove('d-none');
        tickets.forEach((el, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td scope="row">${idx + 1}</td>
                <td>${el.value}</td>
                <td>${el.createdAt}</td>
            `;
            return tableBodyEl.appendChild(tr);
        })
    }
}
loadTableData();

// DELETE TICKETS
deletebtn.addEventListener('click' , (e) => {
    const tickets = JSON.parse(localStorage.getItem('tickets'));
    if(tickets){
        const check = confirm('Are you sure about this ? This will delete all tickets generated. ');
        if(check){
            e.preventDefault();
            window.location.reload();
            localStorage.removeItem('tickets');
        }
    }
    else{
        return;
    }
})

// SEARCH TICKETS;
validateEl.addEventListener('click' , () => {
    const searchValue = searchEl.value;
    if(searchValue){
        const tickets = JSON.parse(localStorage.getItem('tickets'));
        const found = tickets.find(ticket => ticket.value === searchValue);
        if(found){
            alert('This ticket is valid');
        }
        else{
            alert('This ticket is invalid');
        }    
    }
    else{
        return;
    }
});


// ASSIGN SELECTED OPTIONS
const storedOptions = JSON.parse(localStorage.getItem('options'));
if(storedOptions){
    const {hasUpper, hasLower, hasNumber, hasSymbol, length} = storedOptions;
    const storedData = JSON.parse(localStorage.getItem('tickets'));

    lengthEl.value = length;
    lowercaseEl.checked = hasLower;
    uppercaseEl.checked = hasUpper;
    numbersEl.checked = hasNumber;
    symbolsEl.checked = hasSymbol;
    resultEl.value = storedData ? storedData[storedData.length - 1].value : '';
}


// GENERATE TICKET EVENT LISTENER;
generateBtn.addEventListener('click', (e) => {
    let tickets = [];

    const options = {
        length: +lengthEl.value,
        hasLower: lowercaseEl.checked,
        hasUpper: uppercaseEl.checked,
        hasNumber: numbersEl.checked,
        hasSymbol: symbolsEl.checked,
    };

    localStorage.setItem('options', JSON.stringify(options));
    const {hasUpper, hasLower, hasNumber, hasSymbol, length} = options;

    const ticket = generateTicket(hasUpper, hasLower, hasNumber, hasSymbol, length);
    if(!ticket){
        alert('You cannot create an empty ticket')
        return;
    }
    if(localStorage.getItem('tickets')){
        tickets = [...JSON.parse(localStorage.getItem('tickets'))];
    }
    tickets.push({value: ticket, createdAt: new Date().toLocaleString()});
    localStorage.setItem('tickets', JSON.stringify(tickets));

    resultEl.value = ticket;

    let tableData = document.createElement('tr');
    tableData.innerHTML = `
        <td scope="row">${tickets.length}</td>
        <td>${ticket}</td>
        <td>${new Date().toLocaleString()}</td>
    `
    tableBodyEl.appendChild(tableData);

    if(tickets.length === 1) {
        e.preventDefault();
        window.location.reload();
    }
});

// COPY TICKET TO CLIPBOARD
clipboardEl.addEventListener('click', () => {
    const textarea = document.createElement('textarea');
    const ticket = resultEl.value;

    if(!ticket){
        return;
    }

    textarea.value = ticket;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    alert(`Ticket: ${ticket} has been copied to the clipboard`);
});

// GENERATE TICKET FUNCTION
function generateTicket(upper, lower, number, symbol, length){
    let generatedTicket = '';
    const typesCount = lower + upper + number + symbol;
    //console.log('typesCount:', typesCount);

    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0])
    //console.log(typesArr);

    if(typesCount === 0){
        return '';
    }

    for(let i=0; i< length; i+= typesCount){
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            //console.log('funcName:', funcName);
            generatedTicket += randomFunction[funcName]();
        })
    }

    const finalTicket = generatedTicket.slice(0, length);
    return finalTicket;
}


// GENERATOR FUNCTIONS;
function getRandomLower(){
    let randomLowerChar = Math.floor(Math.random() * 26) + 97;
    return String.fromCharCode(randomLowerChar);
}

function getRandomUpper(){
    let randomUpperChar = Math.floor(Math.random() * 26) + 65;
    return String.fromCharCode(randomUpperChar);
}

function getRandomNumber(){
    let randomNumber = Math.floor(Math.random() * 10) + 48;
    return String.fromCharCode(randomNumber);
}

function getRandomSymbol(){
    const symbols = '!@#$%^&(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}
