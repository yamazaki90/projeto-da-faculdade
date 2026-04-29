#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

// ===== IDENTIFICAÇÃO DO GRUPO =====
// Alana Vitorino Guimarães 
// RA:3025105251
// David Auleir de Lima Oliveira 
// RA:3025106722
// Gustavo canevazzi da Silva 
// RA:3025102642
// Guilherme Ferreira Sindice 
// RA:3026102567
// Kaique Silva Neves 
// RA 3025105359
// Kleber Augusto Brilhante de Morais
// RA:3026105022
// Mariana Batista de Paula Vieira 
// RA: :3026105335
// Thierry Fernando Magalhaes 
// RA: 3026101894
// Projeto: Sistema de Registro de Vendas em C (Abre & Reza)

int main()
{
    // Variáveis para armazenar o nome e a senha do cadastro e do login
    char nome[50], nomeLogin[50];
    char senha[30], senhaLogin[30];

    // Variáveis de controle do menu, escolha da caixa e sorteio
    int escolha, sorteio, opcao;

    // Inventário: guarda até 100 itens conquistados pelo usuário
    char inventario[100][50];
    int totalItens = 0;

    // Vetores com os itens de cada categoria
    char itensJogos[5][50] = {
        "Chaveiro tematico", "Jogo", "Fone", "Mousepad", "Poster"
    };

    char itensFilmes[5][50] = {
        "Camiseta tematica", "Poster de filme", "Ingresso de cinema",
        "Ingresso + pipoca", "Blu-ray aleatorio"
    };

    char itensAnimes[5][50] = {
        "Action figure", "Manga", "Chaveiro de anime",
        "Poster de anime", "3 meses de Crunchyroll"
    };

    char itensSeries[5][50] = {
        "Camiseta de serie", "Caneca tematica", "Funko Pop",
        "Poster", "Chaveiro"
    };

    // Inicializa o gerador de números aleatórios
    srand(time(NULL));

    // ================= CADASTRO =================
    printf("=== CADASTRO ===\n");

    printf("Digite seu nome:\n");
    fgets(nome, sizeof(nome), stdin); // Lê nome com espaços
    nome[strcspn(nome, "\n")] = '\0'; // Remove o ENTER

    printf("Digite sua senha:\n");
    fgets(senha, sizeof(senha), stdin); // Lê senha com letras e números
    senha[strcspn(senha, "\n")] = '\0';

    // ================= LOGIN =================
    printf("\n=== LOGIN ===\n");

    printf("Digite seu nome:\n");
    fgets(nomeLogin, sizeof(nomeLogin), stdin);
    nomeLogin[strcspn(nomeLogin, "\n")] = '\0';

    printf("Digite sua senha:\n");
    fgets(senhaLogin, sizeof(senhaLogin), stdin);
    senhaLogin[strcspn(senhaLogin, "\n")] = '\0';

    // Verifica se nome e senha estão corretos
    if(strcmp(nome, nomeLogin) != 0 || strcmp(senha, senhaLogin) != 0)
    {
        printf("Nome ou senha incorretos!\n");
        return 0; // Encerra o programa se o login falhar
    }

    printf("\nLogin realizado com sucesso!\n");

    // ================= MENU PRINCIPAL =================
    do
    {
        printf("\n===== MENU =====\n");
        printf("1 - Abrir caixa\n");
        printf("2 - Sair\n");
        printf("Escolha: ");

        // Valida a entrada do usuário
        if(scanf("%d", &opcao) != 1)
        {
            printf("Entrada invalida!\n");
            break;
        }

        if(opcao == 1)
        {
            // Exibe as categorias disponíveis
            printf("\nEscolha a caixa:\n");
            printf("1 - Jogos\n");
            printf("2 - Filmes\n");
            printf("3 - Animes\n");
            printf("4 - Series\n");
            printf("Opcao: ");

            scanf("%d", &escolha);

            // Sorteia um item aleatório de 0 a 4
            sorteio = rand() % 5;

            // Verifica qual caixa foi escolhida
            switch(escolha)
            {
                case 1:
                    printf("Voce ganhou: %s\n", itensJogos[sorteio]);
                    strcpy(inventario[totalItens], itensJogos[sorteio]);
                    totalItens++;
                    break;

                case 2:
                    printf("Voce ganhou: %s\n", itensFilmes[sorteio]);
                    strcpy(inventario[totalItens], itensFilmes[sorteio]);
                    totalItens++;
                    break;

                case 3:
                    printf("Voce ganhou: %s\n", itensAnimes[sorteio]);
                    strcpy(inventario[totalItens], itensAnimes[sorteio]);
                    totalItens++;
                    break;

                case 4:
                    printf("Voce ganhou: %s\n", itensSeries[sorteio]);
                    strcpy(inventario[totalItens], itensSeries[sorteio]);
                    totalItens++;
                    break;

                default:
                    printf("Opcao invalida!\n");
            }
        }
        else if(opcao != 2)
        {
            printf("Opcao invalida!\n");
        }

    } while(opcao != 2); // Continua até o usuário escolher sair

    // ================= INVENTÁRIO FINAL =================
    printf("\n=== SEUS ITENS ===\n");

    if(totalItens == 0)
    {
        printf("Voce nao ganhou nenhum item.\n");
    }
    else
    {
        for(int i = 0; i < totalItens; i++)
        {
            printf("%d - %s\n", i + 1, inventario[i]);
        }
    }

    printf("\nPrograma encerrado.\n");

    return 0;
}
