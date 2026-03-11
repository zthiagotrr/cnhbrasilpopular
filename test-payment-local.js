#!/usr/bin/env node

/**
 * Script de teste LOCAL (sem usar Vercel)
 * Execute: node test-payment-local.js
 * 
 * Antes, configure as variáveis:
 * $env:VENO_API_KEY = "veno_live_sua_chave"
 */
<script
  src="https://cdn.utmify.com.br/scripts/utms/latest.js"
  data-utmify-prevent-xcod-sck
  data-utmify-prevent-subids
  async
  defer
></script>

<script>
  window.pixelId = "69a4ba81bd00708d6b814f8c";
  var a = document.createElement("script");
  a.setAttribute("async", "");
  a.setAttribute("defer", "");
  a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
  document.head.appendChild(a);
</script>


// Importar o módulo de pagamento diretamente
const paymentModule = require('./api/payment.js');

const testData = {
  cpf: "07317831905",
  nome: "JUAN PABLO MARCONI",
  email: "sashidoblack@gmail.com",
  phone: "(44) 92802-8281",
  amount: "37.73",
  title: "Taxa de Adesão",
};

// Mock de request e response
const req = {
  method: "POST",
  body: testData,
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log(`\n✓ Status: ${this.statusCode}\n`);
    console.log("📊 Resposta:");
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log("\n✅ SUCESSO!\n");
      console.log("✨ Dados para gerar QR Code:");
      console.log(`   Transaction ID: ${data.transaction_id}`);
      console.log(`   PIX Code: ${data.pix_code}`);
      console.log(`   Valor: R$ ${(data.amount / 100).toFixed(2)}`);
      console.log(`   Status: ${data.status}`);
    } else {
      console.log("\n❌ ERRO\n");
    }
    return this;
  },
  send: function(msg) {
    console.log("Erro:", msg);
  }
};

async function test() {
  console.log("🧪 Teste LOCAL da API de pagamento\n");
  console.log("📝 Payload:");
  console.log(JSON.stringify(testData, null, 2));
  console.log("\n---\n");
  console.log("⏳ Processando...");
  
  if (!process.env.VENO_API_KEY) {
    console.error("\n❌ ERRO: Variáveis de ambiente não configuradas!");
    console.error("\nConfigure com:");
    console.error('  $env:VENO_API_KEY = "veno_live_sua_chave"');
    return;
  }

  await paymentModule(req, res);
}

test();
