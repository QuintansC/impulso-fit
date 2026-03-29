import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Impulso Fit API',
      version: '1.0.0',
      description: 'API do e-commerce Impulso Fit — suplementos e equipamentos fitness.',
    },
    servers: [{ url: '/api', description: 'Backend Express' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['cliente', 'admin'] },
            criadoEm: { type: 'string', format: 'date-time' },
          },
        },
        Produto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            descricao: { type: 'string' },
            preco: { type: 'number' },
            imagemUrl: { type: 'string' },
            categoriaId: { type: 'integer' },
            estoque: { type: 'integer' },
            peso: { type: 'integer', nullable: true },
            criadoEm: { type: 'string', format: 'date-time' },
            categoria: { $ref: '#/components/schemas/Categoria' },
          },
        },
        Categoria: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
          },
        },
        Pedido: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuarioId: { type: 'integer' },
            total: { type: 'number' },
            status: { type: 'string', enum: ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'] },
            stripePaymentIntentId: { type: 'string', nullable: true },
            criadoEm: { type: 'string', format: 'date-time' },
            produtos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  produtoId: { type: 'integer' },
                  quantidade: { type: 'integer' },
                  precoUnitario: { type: 'number' },
                  produto: { $ref: '#/components/schemas/Produto' },
                },
              },
            },
          },
        },
        Avaliacao: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuarioId: { type: 'integer' },
            produtoId: { type: 'integer' },
            nota: { type: 'integer', minimum: 1, maximum: 5 },
            comentario: { type: 'string' },
            criadoEm: { type: 'string', format: 'date-time' },
            usuario: {
              type: 'object',
              properties: { id: { type: 'integer' }, nome: { type: 'string' } },
            },
          },
        },
        Erro: {
          type: 'object',
          properties: { erro: { type: 'string' } },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autenticação e perfil' },
      { name: 'Produtos', description: 'Catálogo de produtos (público)' },
      { name: 'Categorias', description: 'Categorias de produtos (público)' },
      { name: 'Pedidos', description: 'Pedidos do usuário autenticado' },
      { name: 'Favoritos', description: 'Lista de favoritos do usuário autenticado' },
      { name: 'Avaliações', description: 'Avaliações de produtos' },
      { name: 'Pagamentos', description: 'Checkout via Stripe' },
      { name: 'Admin — Produtos', description: 'CRUD de produtos (admin)' },
      { name: 'Admin — Categorias', description: 'CRUD de categorias (admin)' },
      { name: 'Admin — Pedidos', description: 'Gestão de pedidos (admin)' },
      { name: 'Admin — Usuários', description: 'Gestão de usuários (admin)' },
    ],
    paths: {
      // ── Auth ──────────────────────────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Cadastrar novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'email', 'senha'],
                  properties: {
                    nome: { type: 'string', example: 'João Silva' },
                    email: { type: 'string', example: 'joao@exemplo.com' },
                    senha: { type: 'string', minLength: 6, example: 'senha123' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Usuário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
            409: { description: 'Email já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'senha'],
                  properties: {
                    email: { type: 'string', example: 'admin@impulsofit.com.br' },
                    senha: { type: 'string', example: 'admin123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Token JWT e dados do usuário',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      usuario: { $ref: '#/components/schemas/Usuario' },
                    },
                  },
                },
              },
            },
            401: { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Perfil do usuário autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dados do usuário', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } },
            401: { description: 'Não autenticado' },
          },
        },
      },

      // ── Produtos ──────────────────────────────────────────────────────────
      '/produtos': {
        get: {
          tags: ['Produtos'],
          summary: 'Listar todos os produtos',
          responses: {
            200: { description: 'Lista de produtos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Produto' } } } } },
          },
        },
      },
      '/produtos/{id}': {
        get: {
          tags: ['Produtos'],
          summary: 'Buscar produto por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Produto encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
            404: { description: 'Produto não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } },
          },
        },
      },

      // ── Categorias ────────────────────────────────────────────────────────
      '/categorias': {
        get: {
          tags: ['Categorias'],
          summary: 'Listar todas as categorias',
          responses: {
            200: { description: 'Lista de categorias', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } } } } },
          },
        },
      },
      '/categorias/{id}': {
        get: {
          tags: ['Categorias'],
          summary: 'Buscar categoria por ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Categoria encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
            404: { description: 'Categoria não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } },
          },
        },
      },

      // ── Pedidos ───────────────────────────────────────────────────────────
      '/pedidos': {
        get: {
          tags: ['Pedidos'],
          summary: 'Listar pedidos do usuário autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de pedidos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pedido' } } } } },
            401: { description: 'Não autenticado' },
          },
        },
      },
      '/pedidos/{id}': {
        get: {
          tags: ['Pedidos'],
          summary: 'Detalhe de um pedido do usuário autenticado',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Pedido encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } },
            403: { description: 'Acesso negado' },
            404: { description: 'Pedido não encontrado' },
          },
        },
      },

      // ── Favoritos ─────────────────────────────────────────────────────────
      '/favoritos': {
        get: {
          tags: ['Favoritos'],
          summary: 'Listar produtos favoritos do usuário autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de produtos favoritos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Produto' } } } } },
            401: { description: 'Não autenticado' },
          },
        },
      },
      '/favoritos/toggle': {
        post: {
          tags: ['Favoritos'],
          summary: 'Adicionar ou remover produto dos favoritos',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['produtoId'],
                  properties: { produtoId: { type: 'integer', example: 1 } },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Estado atualizado',
              content: { 'application/json': { schema: { type: 'object', properties: { favoritado: { type: 'boolean' } } } } },
            },
            401: { description: 'Não autenticado' },
            404: { description: 'Produto não encontrado' },
          },
        },
      },

      // ── Avaliações ────────────────────────────────────────────────────────
      '/avaliacoes/produto/{produtoId}': {
        get: {
          tags: ['Avaliações'],
          summary: 'Listar avaliações de um produto',
          parameters: [{ name: 'produtoId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Lista de avaliações', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Avaliacao' } } } } },
          },
        },
        post: {
          tags: ['Avaliações'],
          summary: 'Criar ou atualizar avaliação (upsert)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'produtoId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nota', 'comentario'],
                  properties: {
                    nota: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                    comentario: { type: 'string', example: 'Produto excelente!' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Avaliação criada/atualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Avaliacao' } } } },
            401: { description: 'Não autenticado' },
            404: { description: 'Produto não encontrado' },
          },
        },
      },

      // ── Pagamentos ────────────────────────────────────────────────────────
      '/pagamentos/create-payment-intent': {
        post: {
          tags: ['Pagamentos'],
          summary: 'Criar PaymentIntent no Stripe',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount'],
                  properties: {
                    amount: { type: 'number', description: 'Valor em centavos', example: 9990 },
                    metadata: { type: 'object', additionalProperties: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Client secret do PaymentIntent',
              content: { 'application/json': { schema: { type: 'object', properties: { clientSecret: { type: 'string' }, amount: { type: 'number' } } } } },
            },
          },
        },
      },
      '/pagamentos/create-order': {
        post: {
          tags: ['Pagamentos'],
          summary: 'Criar pedido após pagamento confirmado no frontend',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['usuarioId', 'produtos', 'total'],
                  properties: {
                    usuarioId: { type: 'integer' },
                    total: { type: 'number' },
                    stripePaymentIntentId: { type: 'string' },
                    produtos: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          produtoId: { type: 'integer' },
                          quantidade: { type: 'integer' },
                          precoUnitario: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Pedido criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } },
            400: { description: 'Estoque insuficiente' },
          },
        },
      },
      '/pagamentos/webhook': {
        post: {
          tags: ['Pagamentos'],
          summary: 'Webhook Stripe (uso interno)',
          description: 'Recebe eventos do Stripe. Requer header `Stripe-Signature`. Corpo em raw bytes.',
          responses: {
            200: { description: 'Evento processado' },
            400: { description: 'Assinatura inválida' },
          },
        },
      },

      // ── Admin — Produtos ──────────────────────────────────────────────────
      '/admin/produtos': {
        get: {
          tags: ['Admin — Produtos'],
          summary: 'Listar todos os produtos',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de produtos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Produto' } } } } },
          },
        },
        post: {
          tags: ['Admin — Produtos'],
          summary: 'Criar produto',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'descricao', 'preco', 'imagemUrl', 'categoriaId'],
                  properties: {
                    nome: { type: 'string' },
                    descricao: { type: 'string' },
                    preco: { type: 'number' },
                    imagemUrl: { type: 'string' },
                    categoriaId: { type: 'integer' },
                    peso: { type: 'integer', nullable: true },
                    estoque: { type: 'integer', default: 0 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Produto criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
          },
        },
      },
      '/admin/produtos/{id}': {
        get: {
          tags: ['Admin — Produtos'],
          summary: 'Buscar produto por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Produto encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
            404: { description: 'Não encontrado' },
          },
        },
        put: {
          tags: ['Admin — Produtos'],
          summary: 'Atualizar produto',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nome: { type: 'string' },
                    descricao: { type: 'string' },
                    preco: { type: 'number' },
                    imagemUrl: { type: 'string' },
                    categoriaId: { type: 'integer' },
                    peso: { type: 'integer', nullable: true },
                    estoque: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Produto atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Produto' } } } },
            404: { description: 'Não encontrado' },
          },
        },
        delete: {
          tags: ['Admin — Produtos'],
          summary: 'Remover produto',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Produto removido' },
            404: { description: 'Não encontrado' },
          },
        },
      },

      // ── Admin — Categorias ────────────────────────────────────────────────
      '/admin/categorias': {
        get: {
          tags: ['Admin — Categorias'],
          summary: 'Listar categorias',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de categorias', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } } } } },
          },
        },
        post: {
          tags: ['Admin — Categorias'],
          summary: 'Criar categoria',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['nome'], properties: { nome: { type: 'string' } } } } },
          },
          responses: {
            201: { description: 'Categoria criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
          },
        },
      },
      '/admin/categorias/{id}': {
        put: {
          tags: ['Admin — Categorias'],
          summary: 'Atualizar categoria',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { type: 'object', required: ['nome'], properties: { nome: { type: 'string' } } } } },
          },
          responses: {
            200: { description: 'Categoria atualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Categoria' } } } },
            404: { description: 'Não encontrada' },
          },
        },
        delete: {
          tags: ['Admin — Categorias'],
          summary: 'Remover categoria',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Categoria removida' },
            404: { description: 'Não encontrada' },
          },
        },
      },

      // ── Admin — Pedidos ───────────────────────────────────────────────────
      '/admin/pedidos': {
        get: {
          tags: ['Admin — Pedidos'],
          summary: 'Listar todos os pedidos',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de pedidos', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pedido' } } } } },
          },
        },
      },
      '/admin/pedidos/{id}': {
        get: {
          tags: ['Admin — Pedidos'],
          summary: 'Detalhe de um pedido',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Pedido encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } },
            404: { description: 'Não encontrado' },
          },
        },
      },
      '/admin/pedidos/{id}/status': {
        put: {
          tags: ['Admin — Pedidos'],
          summary: 'Atualizar status do pedido',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: { type: 'string', enum: ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Status atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } } },
            404: { description: 'Não encontrado' },
          },
        },
      },

      // ── Admin — Usuários ──────────────────────────────────────────────────
      '/admin/usuarios': {
        get: {
          tags: ['Admin — Usuários'],
          summary: 'Listar todos os usuários',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Lista de usuários com contagem de pedidos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      allOf: [
                        { $ref: '#/components/schemas/Usuario' },
                        { type: 'object', properties: { _count: { type: 'object', properties: { pedidos: { type: 'integer' } } } } },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/admin/usuarios/{id}': {
        delete: {
          tags: ['Admin — Usuários'],
          summary: 'Remover usuário',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Usuário removido' },
            404: { description: 'Não encontrado' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
