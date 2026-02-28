// =====================
// TABLA
// =====================
const tabla = [
  { mm: 0, m3: 0 }, { mm: 2, m3: 4.2 }, { mm: 50, m3: 75.6 },
  { mm: 100, m3: 213.36 }, { mm: 200, m3: 608.16 }, { mm: 300, m3: 1119.72 },
  { mm: 400, m3: 1720.32 }, { mm: 500, m3: 2394.84 }, { mm: 600, m3: 3129 },
  { mm: 700, m3: 3913.56 }, { mm: 800, m3: 4739.28 }, { mm: 880, m3: 5423.04 },
  { mm: 900, m3: 5596.92 }, { mm: 1000, m3: 6479.76 }, { mm: 1060, m3: 7019.04 },
  { mm: 1100, m3: 7381.08 }, { mm: 1200, m3: 8293.32 }, { mm: 1300, m3: 9209.76 },
  { mm: 1400, m3: 10124.52 }, { mm: 1500, m3: 11030.88 }, { mm: 1600, m3: 11922.12 },
  { mm: 1700, m3: 12790.68 }, { mm: 1800, m3: 13629 }, { mm: 1900, m3: 14430.36 },
  { mm: 2000, m3: 15185.52 }, { mm: 2100, m3: 15884.4 }, { mm: 2200, m3: 16515.24 },
  { mm: 2300, m3: 17063.76 }, { mm: 2360, m3: 17334.32 }, { mm: 2400, m3: 17508.12 },
  { mm: 2410, m3: 17556 }
];

// =====================
// ESTADO (persistente)
// =====================
let ultimoTotal = 0;
let stockPorIsotanque =
  JSON.parse(localStorage.getItem("stockPorIsotanque")) || [0,0,0,0];

// =====================
// UTIL NUMÉRICA
// =====================
function parseNumero(valor){
  if(!valor) return 0;
  valor = valor.trim();
  valor = valor.replace(",", ".");
  valor = valor.replace(/[^0-9.]/g, "");
  return parseFloat(valor) || 0;
}

// =====================
// UTILIDADES
// =====================
function totalBordo(){
  return stockPorIsotanque.reduce((acc,n)=>acc+n,0);
}

function isotanqueActualIndex(){
  return Number(document.getElementById("isotanqueSelect").value)-1;
}

function guardarStock(){
  localStorage.setItem(
    "stockPorIsotanque",
    JSON.stringify(stockPorIsotanque)
  );
}

function actualizarStockUI(){
  const idx = isotanqueActualIndex();
  const stockActual = stockPorIsotanque[idx] || 0;

  document.getElementById("stockIsotanque").textContent =
    `Stock isotanque seleccionado: ${stockActual.toFixed(2)} m³`;

  document.getElementById("saldoRestante").textContent =
    `Stock a bordo: ${totalBordo().toFixed(2)} m³`;
}

function actualizarCargaTotalInicialUI(valor){
  document.getElementById("cargaTotalInicial").value =
    valor > 0 ? valor.toFixed(2) : "";
}

// =====================
// TOTAL INICIAL AUTOMÁTICO
// =====================
function recalcularTotalInicial(){

  const cargas = [
    parseNumero(document.getElementById("saldoIso1").value),
    parseNumero(document.getElementById("saldoIso2").value),
    parseNumero(document.getElementById("saldoIso3").value),
    parseNumero(document.getElementById("saldoIso4").value)
  ];

  stockPorIsotanque = cargas;

  guardarStock();

  const total = totalBordo();

  actualizarCargaTotalInicialUI(total);
  actualizarStockUI();
}

// =====================
// INTERPOLAR
// =====================
function interpolar(mm){
  if(mm===""||isNaN(mm)) return null;
  mm = Number(mm);
  if(mm < tabla[0].mm || mm > tabla[tabla.length-1].mm) return "fuera";

  for(let i=0;i<tabla.length-1;i++){
    const a=tabla[i];
    const b=tabla[i+1];
    if(mm>=a.mm && mm<=b.mm){
      const r=(mm-a.mm)/(b.mm-a.mm);
      return a.m3 + r*(b.m3-a.m3);
    }
  }
}

// =====================
// CALCULO DESCARGA
// =====================
function actualizar(){
  const A=interpolar(document.getElementById("nivelA").value);
  const B=interpolar(document.getElementById("nivelB").value);

  if(typeof A==="number" && typeof B==="number"){
    ultimoTotal=Math.abs(A-B);
    document.getElementById("resultado").textContent =
      `Total descargado: ${ultimoTotal.toFixed(2)} m³`;
  }else{
    ultimoTotal=0;
    document.getElementById("resultado").textContent =
      "Total descargado: —";
  }
}

// =====================
// RESTAURAR AL INICIAR
// =====================
window.addEventListener("load", ()=>{
  document.getElementById("saldoIso1").value = stockPorIsotanque[0] || "";
  document.getElementById("saldoIso2").value = stockPorIsotanque[1] || "";
  document.getElementById("saldoIso3").value = stockPorIsotanque[2] || "";
  document.getElementById("saldoIso4").value = stockPorIsotanque[3] || "";

  actualizarStockUI();
  actualizarCargaTotalInicialUI(totalBordo());
});

// =====================
// EVENTOS
// =====================
document.getElementById("nivelA").addEventListener("input",actualizar);
document.getElementById("nivelB").addEventListener("input",actualizar);
document.getElementById("isotanqueSelect").addEventListener("change",actualizarStockUI);

document.getElementById("saldoIso1").addEventListener("input",recalcularTotalInicial);
document.getElementById("saldoIso2").addEventListener("input",recalcularTotalInicial);
document.getElementById("saldoIso3").addEventListener("input",recalcularTotalInicial);
document.getElementById("saldoIso4").addEventListener("input",recalcularTotalInicial);
