// ==========================================================================
// 1. INICIALIZAÇÃO DE DADOS (SEED)
// - Garante que a aplicação tenha dados iniciais quando aberta pela primeira vez.
// ==========================================================================

// Define os dados padrão para veículos e usuários.
const carrosIniciais = [
    {
        id: Date.now() + 1, // Usando timestamp para garantir um ID único
        nomeCliente: "Bruno Silva",
        cpf: "123.456.789-00",
        telefone: "(11) 98765-4321",
        endereco: "Rua das Flores, 123",
        email: "bruno.silva@example.com",
        comprador: "Bruno Silva",
        modelo: "Corolla",
        placa: "ABC-1234",
        valor: "110000.00",
        cor: "Prata",
        ano: "2022",
        condicaoPagamento: ["financiamento"]
    },
    {
        id: Date.now() + 2,
        nomeCliente: "Maria Oliveira",
        cpf: "987.654.321-00",
        telefone: "(21) 91234-5678",
        endereco: "Avenida Principal, 456",
        email: "maria.oliveira@example.com",
        comprador: "Empresa X",
        modelo: "Onix",
        placa: "DEF-5678",
        valor: "78000.00",
        cor: "Branco",
        ano: "2023",
        condicaoPagamento: ["pix", "cartao"]
    }
];

const usuariosIniciais = [
    {
        nome: "Professor Avaliador",
        email: "professor@uninter.com",
        senha: "123" // Senha simples para fins acadêmicos
    }
];

// Função que popula o localStorage se ele estiver vazio.
function inicializarDados() {
    if (!localStorage.getItem('veiculos')) {
        localStorage.setItem('veiculos', JSON.stringify(carrosIniciais));
    }
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciais));
    }
}


// ==========================================================================
// 2. FUNÇÕES DE LÓGICA E MANIPULAÇÃO DO DOM
// - Funções que controlam o comportamento de cada página.
// ==========================================================================

// Roda o código específico da página assim que o HTML for carregado.
document.addEventListener('DOMContentLoaded', () => {
    
    // Antes de tudo, garante que os dados iniciais existam.
    inicializarDados();

    // --- LÓGICA DA PÁGINA DE LOGIN ---
    if (document.getElementById('login-form')) {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            const email = document.getElementById('email').value;
            const senha = document.getElementById('password').value;

            const usuarios = JSON.parse(localStorage.getItem('usuarios'));

            const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuarioEncontrado) {
                alert('Login realizado com sucesso!');
                // Salva um indicador de que o usuário está logado
                sessionStorage.setItem('usuarioLogado', 'true');
                // Redireciona para a página de listagem
                window.location.href = 'listagemVeiculos.html';
            } else {
                alert('Email ou senha inválidos.');
            }
        });
    }

    // --- LÓGICA DA PÁGINA DE CADASTRO DE USUÁRIO ---
    if (document.getElementById('cadastro-usuario-form')) {
        const form = document.getElementById('cadastro-usuario-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios'));
            
            // Verifica se o e-mail já existe
            const emailExistente = usuarios.some(user => user.email === email);
            if (emailExistente) {
                alert('Este e-mail já está em uso!');
                return;
            }

            // Adiciona o novo usuário
            const novoUsuario = { nome, email, senha };
            usuarios.push(novoUsuario);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'index.html';
        });
    }

    // --- LÓGICA DA PÁGINA DE CADASTRO DE VEÍCULO ---
    if (document.getElementById('cadastro-veiculo-form')) {
        const form = document.getElementById('cadastro-veiculo-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const condicoesPagamento = [];
            document.querySelectorAll('input[name="condicao-pagamento"]:checked').forEach((checkbox) => {
                condicoesPagamento.push(checkbox.value);
            });

            const novoVeiculo = {
                id: Date.now(), // ID único
                nomeCliente: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                telefone: document.getElementById('telefone').value,
                endereco: document.getElementById('endereco').value,
                email: document.getElementById('email').value,
                comprador: document.getElementById('comprador').value,
                modelo: document.getElementById('modelo').value,
                placa: document.getElementById('placa').value,
                valor: document.getElementById('valor').value,
                cor: document.getElementById('cor').value,
                ano: document.getElementById('ano').value,
                condicaoPagamento: condicoesPagamento
            };

            const veiculos = JSON.parse(localStorage.getItem('veiculos'));
            veiculos.push(novoVeiculo);
            localStorage.setItem('veiculos', JSON.stringify(veiculos));

            alert('Veículo cadastrado com sucesso!');
            form.reset(); // Limpa o formulário
        });
    }

    // --- LÓGICA DA PÁGINA DE LISTAGEM DE VEÍCULOS ---
    if (document.getElementById('tabela-veiculos-corpo')) {
        const corpoTabela = document.getElementById('tabela-veiculos-corpo');
        const campoBusca = document.getElementById('campo-busca');

        // Função para renderizar os veículos na tabela
        const renderizarVeiculos = (filtro = '') => {
            const veiculos = JSON.parse(localStorage.getItem('veiculos'));
            corpoTabela.innerHTML = ''; // Limpa a tabela antes de preencher

            const veiculosFiltrados = veiculos.filter(veiculo => 
                veiculo.placa.toLowerCase().includes(filtro.toLowerCase()) ||
                veiculo.modelo.toLowerCase().includes(filtro.toLowerCase()) ||
                veiculo.nomeCliente.toLowerCase().includes(filtro.toLowerCase())
            );

            if (veiculosFiltrados.length === 0) {
                corpoTabela.innerHTML = '<tr><td colspan="7">Nenhum veículo encontrado.</td></tr>';
                return;
            }

            veiculosFiltrados.forEach(veiculo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.modelo}</td>
                    <td>${veiculo.nomeCliente}</td>
                    <td>${veiculo.valor}</td>
                    <td>${veiculo.ano}</td>
                    <td>${veiculo.cor}</td>
                    <td>
                        <button>Editar</button>
                        <button>Excluir</button>
                    </td>
                `;
                corpoTabela.appendChild(tr);
            });
        };
        
        // Adiciona um "escutador" para o campo de busca
        campoBusca.addEventListener('input', () => {
            renderizarVeiculos(campoBusca.value);
        });

        // Renderiza a lista completa ao carregar a página
        renderizarVeiculos();
    }
});

function abrirPopup(modelo, marca, cor, ano, valor, comprador, condicao, imagem) {
  document.getElementById("popup-modelo").textContent = modelo;
  document.getElementById("popup-marca").textContent = marca;
  document.getElementById("popup-cor").textContent = cor;
  document.getElementById("popup-ano").textContent = ano;
  document.getElementById("popup-valor").textContent = valor;
  document.getElementById("popup-comprador").textContent = comprador;
  document.getElementById("popup-condicao").textContent = condicao;
 

  document.getElementById("popup-veiculo").style.display = "flex";
}

function fecharPopup() {
  document.getElementById("popup-veiculo").style.display = "none";
}
