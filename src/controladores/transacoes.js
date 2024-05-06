let {contas, saques, depositos, transferencias} = require ('../bancodedados')
const { format } = require('date-fns')

const depositar = (req,res)=> {
    const {numero_conta, valor} = req.body;

    if (numero_conta === undefined) {
        return res.status(400).json({ "mensagem": "O número da conta é obrigatório!"});
    };

    if (!valor) {
        return res.status(400).json({"mensagem": "O valor é obrigatório!"});
    };

    const numeroDaConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta)
    });
    
    if (!numeroDaConta) {
        return res.status(404).json({"mensagem": "Numero da conta informado é inexistente"});
    
    };

    if (valor<= 0) {
        return res.status(400).json({"mensagem": "Não é permitido depósitos com valores negativos ou zerados"});
    };

    numeroDaConta.saldo = numeroDaConta.saldo + valor 

    let registroDeDeposito= {
        data: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        numero_conta: numero_conta,
        valor: Number(valor)
    }

    depositos.push(registroDeDeposito);

    return res.status(201).send();
}
const sacar = (req,res)=> {
    const {numero_conta, valor, senha} = req.body;

    if (numero_conta === undefined) {
        return res.status(400).json({ "mensagem": "O número da conta é obrigatório!"});
    };

    if (!valor) {
        return res.status(400).json({"mensagem": "O valor é obrigatório!"});
    };

    if (!senha) {
        return res.status(400).json({"mensagem": "A senha é obrigatória!"});
    };

    const numeroDaConta = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta)
    });
    
    if (!numeroDaConta) {
        return res.status(404).json({"mensagem": "Numero da conta informado é inexistente"});
    
    };

    if (numeroDaConta.usuario.senha !== senha) {
        return res.status(404).json({"mensagem": "A senha esta invalida!"});
    };

    if (numeroDaConta.saldo < valor) {
        return res.status(403).json({"mensagem": "o saldo não é permitido para realizar saque "});
    };

    numeroDaConta.saldo = numeroDaConta.saldo - valor 

    let registroDeDeposito= {
        data: (new Date(), 'dd-MM-yyyy HH:mm:ss'),
        numero_conta: numero_conta,
        valor: Number(valor)
    }

    saques.push(registroDeDeposito);

    return res.status(201).send();
}
const transferir = (req,res)=>{
    const {numero_conta_origem, numero_conta_destino, valor, senha} = req.body;

    if (numero_conta_origem === undefined) {
        return res.status(400).json({ "mensagem": "O número da conta de origem é obrigatório!"});
    };

    if (numero_conta_destino === undefined) {
        return res.status(400).json({ "mensagem": "O número da conta de destino é obrigatório!"});
    };

    if (!valor) {
        return res.status(400).json({"mensagem": "O valor é obrigatório!"});
    };

    if (!senha) {
        return res.status(400).json({"mensagem": "A senha é obrigatória!"});

    };

    const ContaOrigem = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_origem)
    });
    
    if (!ContaOrigem) {
        return res.status(404).json({ "mensagem": "O número da conta de origem inválida "});
    };

    const ContaDestino = contas.find((conta) => {
        return Number(conta.numero) === Number(numero_conta_destino)
    });
    
    if (!ContaDestino) {
        return res.status(404).json({ "mensagem": "O número da conta de destino inválida "});
    };

    if (ContaOrigem.usuario.senha !== senha) {
        return res.status(400).json({"mensagem": "A senha esta invalida!"});
    };

    if (ContaOrigem.saldo < valor) {
        return res.status(403).json({"mensagem": "o saldo não é permitido para realizar transferência "});
    };

    ContaOrigem.saldo = ContaOrigem.saldo-valor;
    ContaDestino.saldo = ContaDestino.saldo+valor;

    const registroDeTransferencia = {
        data: (new Date(), 'dd-MM-yyyy HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }
       
    transferencias.push(registroDeTransferencia);

    return res.status(201).send();
}

module.exports = {
    depositar,
    sacar,
    transferir
}


