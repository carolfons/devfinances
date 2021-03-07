const Modal = {
  open() {
    //abrir modal
    document.querySelector('.modal-overlay')
    .classList
    .add('active');
  },
  close() {
    //fechar modal
    document.querySelector('.modal-overlay')
    .classList
    .remove('active');
  },
}

const transactions = [{
  id: 1,
  description: 'Luz',
  amount: -50000,
  date:'23/01/2021',

  },
  {
  id: 2,
  description: 'Website',
  amount: 500000,
  date:'23/01/2021',

  },
  {
  id: 3,
  description: 'Internet',
  amount: -20000,
  date:'23/01/2021',

  },
]

const Transaction = {

  all: transactions,
  add(transaction){
    Transaction.all.push(transaction)

    App.reload()
  },
  //somar as entradas
  incomes(){
    let income = 0;
    //pegar cada transação com forEach
    Transaction.all.forEach((transaction) => {
      //verificar se a transação é maior que zero
      if(transaction.amount > 0){
        //incrementar variável
        income = income+transaction.amount;
      }
    })

    return income;
  },

  //somar as saídas
  expenses(){

    let expense = 0;
    //pegar cada transação com forEach
    Transaction.all.forEach((transaction) => {
      //verificar se a transação é menor que zero
      if(transaction.amount < 0){
        //incrementar variável
        expense = expense+transaction.amount;
      }
    })

    return expense;
    
  },
  //entradas - saídas
  total(){
    return Transaction.incomes() + Transaction.expenses();
  }
}

const DOM = {
  //  container
  transactionsContainer:document.querySelector('#data-table tbody'),

  addTransaction(transaction, index){
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);
    
    DOM.transactionsContainer.appendChild(tr);

  },
  innerHTMLTransaction(transaction) {
    //caso o amount for > 0 então a classe css é substituida pela "income"
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img src="./assets/minus.svg" alt="remover" /></td>
    `
    return html;
  },

  updateBalance(){
    document.getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes());

    document.getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses());

    document.getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total());
  },
  clearTransaction(){
    DOM.transactionsContainer.innerHTML = "";
  }
}

const Utils = {
  formatCurrency(value){
  //  Lógica para sinais negativos
    const signal = Number(value) < 0 ? "-":"";
  //  lógica para formatar o valor para R$ 0,00
    value = String(value).replace(/\D/g,"");
    value = Number(value)/100;
    value = value.toLocaleString("pt-BR", {
      style:"currency",
      currency:"BRL"
    })
    return signal+value

  }
}

const App = {
  init(){

    Transaction.all.forEach(function(transaction){
      DOM.addTransaction(transaction);
    })
    
    DOM.updateBalance();

  },
  reload(){
    DOM.clearTransaction();
    App.init();
  },
}

App.init();

Transaction.add({
  id:39,
  description:'Faxina',
  amount: -7000,
  date:'05/03/2021'
})