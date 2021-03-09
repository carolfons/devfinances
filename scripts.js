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

//salvando dados no Local Storage
const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions){
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
  }
}

const Transaction = {

  all: Storage.get(),
  //adicionar transações
  add(transaction){
    Transaction.all.push(transaction)

    App.reload()
  },
  
//remover transações
  remove(index){
    //slipce() => função para remover de acordo com o indice e a quantidade
    //a partir do indice
    Transaction.all.splice(index,1);
    App.reload();
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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction,index);
    tr.dataset.index = index;
    
    DOM.transactionsContainer.appendChild(tr);

  },
  innerHTMLTransaction(transaction,index) {
    //caso o amount for > 0 então a classe css é substituida pela "income"
    const CSSclass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover" /></td>
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
  
  formatAmount(value){
    value = Number(value.replace(/\,\./g,"")) *100;
    return value;
  },

  formatDate(date){
    const splittedDate = date.split("-")
  //retornando no padrão dd/mm/yyyy
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

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

  },

}

const Form = {
  //linkando o JS com o HTML
  description:document.querySelector('input#description'),
  amount:document.querySelector('input#amount'),
  date:document.querySelector('input#date'),

  //guardando os valores
  getValues(){
    return{
      description: Form.description.value,
      amount: Form.amount.value,
      date:Form.date.value,
    }
  },

  validateFields(){
    const {description, amount, date} = Form.getValues();
    if(description.trim() === "" || amount.trim() ===""|| date.trim() ===""){
      throw new Error("Preencha todos os campos");
    }
  },

  formatValues(){
    let {description, amount, date} = Form.getValues();
    //formatando as var recebidas
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return{
      description,
      amount,
      date
    }
  },

  saveTransaction(transaction){
    Transaction.add(transaction);
  },

  clearFields(){

    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },
  
  submit(event){
    event.preventDefault();

    try {
    // verificando se todas as infos foram preenchidas
      Form.validateFields();
    //formatando os dados
      const transaction = Form.formatValues();
    //salvando
      Form.saveTransaction(transaction);
    //apagando os dados
      Form.clearFields();
    //fechando modal
      Modal.close();

    } catch (error) {
      alert(error.message);
    }
    
  }
}


const App = {
  init(){

    Transaction.all.forEach(function(transaction,index){
      DOM.addTransaction(transaction,index);
    })
    
    //atualizando cartões
    DOM.updateBalance();
    //atualizando a local storage
    Storage.set(Transaction.all);

  },
  reload(){
    DOM.clearTransaction();
    App.init();
  },
}

App.init();

