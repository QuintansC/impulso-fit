import nodemailer from 'nodemailer';
import { getTransporter } from '../lib/mailer';

interface ItemEmail {
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

interface DadosPedido {
  id: number;
  total: number;
  status: string;
  criadoEm: Date;
  itens: ItemEmail[];
}

export async function enviarConfirmacaoPedido(
  destinatario: string,
  nomeCliente: string,
  pedido: DadosPedido,
): Promise<void> {
  const transporter = await getTransporter();

  const linhasItens = pedido.itens
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;">${item.nome}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;text-align:center;">${item.quantidade}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;text-align:right;">R$ ${item.precoUnitario.toFixed(2)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #2a2a2a;color:#e0e0e0;text-align:right;font-weight:bold;">R$ ${(item.quantidade * item.precoUnitario).toFixed(2)}</td>
      </tr>`,
    )
    .join('');

  const dataFormatada = new Date(pedido.criadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmação de Pedido #${pedido.id}</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#b71c1c,#7b1fa2);padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">IMPULSO FIT</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Seu pedido foi confirmado!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#1a1a1a;padding:32px 40px;">

              <p style="margin:0 0 24px;color:#e0e0e0;font-size:16px;">
                Olá, <strong style="color:#ffffff;">${nomeCliente}</strong>!
              </p>
              <p style="margin:0 0 32px;color:#9e9e9e;font-size:14px;line-height:1.6;">
                Recebemos seu pedido e o pagamento foi confirmado com sucesso.
                Em breve você receberá informações sobre a entrega.
              </p>

              <!-- Detalhes do pedido -->
              <div style="background-color:#111111;border:1px solid #2a2a2a;border-radius:8px;padding:20px;margin-bottom:28px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span style="color:#9e9e9e;font-size:13px;">Pedido</span>
                  <span style="color:#ffffff;font-weight:700;font-size:13px;">#${pedido.id}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span style="color:#9e9e9e;font-size:13px;">Data</span>
                  <span style="color:#ffffff;font-size:13px;">${dataFormatada}</span>
                </div>
                <div style="display:flex;justify-content:space-between;">
                  <span style="color:#9e9e9e;font-size:13px;">Status</span>
                  <span style="color:#4caf50;font-weight:700;font-size:13px;text-transform:uppercase;">${pedido.status}</span>
                </div>
              </div>

              <!-- Tabela de itens -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;border-radius:8px;overflow:hidden;margin-bottom:20px;">
                <thead>
                  <tr style="background-color:#222222;">
                    <th style="padding:10px 12px;text-align:left;color:#9e9e9e;font-size:12px;font-weight:600;text-transform:uppercase;">Produto</th>
                    <th style="padding:10px 12px;text-align:center;color:#9e9e9e;font-size:12px;font-weight:600;text-transform:uppercase;">Qtd</th>
                    <th style="padding:10px 12px;text-align:right;color:#9e9e9e;font-size:12px;font-weight:600;text-transform:uppercase;">Unitário</th>
                    <th style="padding:10px 12px;text-align:right;color:#9e9e9e;font-size:12px;font-weight:600;text-transform:uppercase;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${linhasItens}
                </tbody>
              </table>

              <!-- Total -->
              <div style="text-align:right;margin-bottom:32px;">
                <span style="color:#9e9e9e;font-size:14px;">Total do pedido: </span>
                <span style="color:#b71c1c;font-size:22px;font-weight:800;">R$ ${pedido.total.toFixed(2)}</span>
              </div>

              <!-- Info de entrega -->
              <div style="background-color:#1b3a1b;border:1px solid #2e7d32;border-radius:8px;padding:16px;margin-bottom:24px;">
                <p style="margin:0;color:#a5d6a7;font-size:14px;">
                  📦 <strong>Próximos passos:</strong> Seu pedido será preparado e enviado em até 2 dias úteis.
                  Você receberá o código de rastreio por email assim que for despachado.
                </p>
              </div>

              <p style="margin:0;color:#616161;font-size:13px;line-height:1.6;">
                Dúvidas? Responda este email ou acesse nossa central de atendimento.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#111111;padding:20px 40px;border-top:1px solid #2a2a2a;border-radius:0 0 12px 12px;text-align:center;">
              <p style="margin:0;color:#424242;font-size:12px;">
                © ${new Date().getFullYear()} Impulso Fit · Todos os direitos reservados
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? 'Impulso Fit <noreply@impulsofit.com.br>',
    to: destinatario,
    subject: `Pedido #${pedido.id} confirmado — Impulso Fit`,
    html,
  });

  // Em dev com Ethereal, loga a URL de preview
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`📧 Email de teste — visualize em: ${previewUrl}`);
  }
}
