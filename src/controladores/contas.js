let {banco, contas, saques, depositos, transferencias} = require('../bancodedados');
let idFinal = 1;

const listarContas = (req, res) => {
    const {senha_banco} = req.query;

    if (senha_banco === "") {
    return res.status(400).json({"mensagem": "É Obrigatório informar a senha do banco"});
    };

    if (senha_banco !== banco.senha){
    return res.status(400).json({"mensagem": "A senha do banco informada é inválida!"});
    };
    
return res.status(200).json(contas);
    
};

const criarConta = (req, res) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha  ) {
        return res.status(400).json({"mensagem": "É obrigatório que todos os campos sejam preenchidos!"});
    };

    const conferenciaEmailECpf = contas.find((conta) => {
        return conta.usuario.email === email || conta.usuario.cpf === cpf
    });

    if (conferenciaEmailECpf) {
        return res.status(400).json({"mensagem": "Já existe uma conta com o cpf ou e-mail informado!"});
    
    };

    const contaCadastrada = {
        numero: idFinal++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    };
    contas.push(contaCadastrada);
    return res.status(201).send();

};
const atualizarCadastroDoUsuario = (req, res) => {
    const {nome, cpf, data_nascimento, telefone, email, senha} = req.body;
    const {numeroConta} = req.params;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha  ) {
        return res.status(400).json({"mensagem": "É obrigatório que todos os campos sejam preenchidos!"});
    };

    const numeroDaConta = contas.find((conta) => {
        return (conta.numero) === Number(numeroConta)
    });

    if (!numeroDaConta) {

        return res.status(404).json({"mensagem": "Numero da conta informado é inexistente"});
    
    };

    if (cpf !== numeroDaConta.usuario.cpf ){
        const cpfExistente = contas.find((conta) => {
            return conta.usuario.cpf === cpf
        })

        if (cpfExistente){
            return res.status(400).json({"mensagem": "O CPF informado já existe cadastrado!"});
        }
    };

    if (email !== numeroDaConta.usuario.email ){
        const emailExistente = contas.find((conta) => {
            return conta.usuario.email === email;
        });

        if (emailExistente){
            return res.status(400).json({"mensagem": "O email informado já existe cadastrado!"});
        }

        if (emailExistente){
            return res.status(400).json({"mensagem": "O email informado já existe cadastrado!"});
        }
    };
    
    numeroDaConta.usuario = {
        nome,
        cpf,
        data_nascimento,
        telefone,
        email,
        senha
    };

    return res.status(200).send();  

};

const excluirConta = (req, res) => {
    const {numeroConta} = req.params;

    const numeroDaConta = contas.find((conta) => {
        return (conta.numero) === Number(numeroConta)
    });

    if (numeroDaConta === undefined) {
        return res.status(404).json({"mensagem": "Numero da conta informado é inexistente"});
    
    };

    if (numeroDaConta.saldo > 0) {
        return res.status(400).json({"mensagem": "A conta bancária só poderá ser deletada se o saldo for 0 (zero)"});
    }

    contas = contas.filter((conta) => {
        return (conta.numero) !== Number(numeroConta);
    });

    return res.status(204).send();

};

const saldo = (req,res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({ "mensagem": "O número da conta é obrigatório!"});
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
        return res.status(400).json({"mensagem": "A senha esta invalida!"});
    };

    return res.json({saldo: numeroDaConta.saldo});

};

const extrato = (req,res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta) {
        return res.status(400).json({ "mensagem": "O número da conta é obrigatório!"});
    };

    if (!senha) {
        return res.status(400).json({"mensagem": "A senha é obrigatória!"});

    };

    const conta = contas.find((conta) => {
        return (conta.numero) === Number(numero_conta)
    });

    if (!conta) {
        return res.status(404).json({"mensagem": "Numero da conta informado é inexistente"});
    
    };

    if (conta.usuario.senha !== senha) {
        return res.status(400).json({"mensagem": "A senha esta invalida!"});
    };

    const exbiçãoDeDepositos = depositos.filter((deposito) => {
        return (deposito.numero_conta) === Number(numero_conta)
    });

    const exbiçãoDeSaques = saques.filter ( saque => {
        return Number(saque.numero_conta) === Number(numero_conta)
    });

    const envioDeTransferencias = transferencias.filter ( transferencia => {
        return Number(transferencia.numero_conta_origem) === Number(numero_conta)
    });

    const transferenciasRecebidas = transferencias.filter ( transferencia => {
        return Number(transferencia.numero_conta_destino) === Number(numero_conta)
    });

    return res.json({
        depositos: exbiçãoDeDepositos,
        saques: exbiçãoDeSaques,
        envioDeTransferencias,
        transferenciasRecebidas
        
    })

}
module.exports = {
    listarContas,
    criarConta,
    atualizarCadastroDoUsuario,
    excluirConta,
    saldo,
    extrato

};