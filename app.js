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
// ESTADO
// =====================
let ultimoTotal = 0;
let stockPorIsotanque = JSON.parse(localStorage.getItem("stockPorIsotanque")) || [0,0,0,0];
let historial = JSON.parse(localStorage.getItem("historialDescargas")) || [];
let cargaTotalInicial = Number(localStorage.getItem("cargaTotalInicial")) || 0;

// =====================
// CAMPAÑAS
// =====================
let campaigns = JSON.parse(localStorage.getItem("campaigns")) || [];

function saveCampaigns(){
  localStorage.setItem("campaigns", JSON.stringify(campaigns));
}

function getActiveCampaign(){
  return campaigns.find(c => c.endTimestamp === null) || null;
}

function startCampaign(){
  if(getActiveCampaign()) return alert("Ya existe una campaña activa");

  const initialStocks = {};
  stockPorIsotanque.forEach((s,i)=> initialStocks[i+1]=s);

  campaigns.push({
    id:"camp_"+Date.now(),
    startTimestamp:new Date().toISOString(),
    endTimestamp:null,
    initialStocks
  });

  saveCampaigns();
  alert("Campaña iniciada");
}

function cerrarCampana(){
  const active=getActiveCampaign();
  if(!active) return alert("No hay campaña activa");

  active.endTimestamp=new Date().toISOString();
  saveCampaigns();
  alert("Campaña cerrada");
}

// =====================
// INTERPOLAR
// =====================
function interpolar(mm){
  if(mm===""||isNaN(mm)) return null;
  mm=Number(mm);
  if(mm<tabla[0].mm||mm>tabla[tabla.length-1].mm) return "fuera";

  for(let i=0;i<tabla.length-1;i++){
    const a=tabla[i];
    const b=tabla[i+1];
    if(mm>=a.mm&&mm<=b.mm){
      const r=(mm-a.mm)/(b.mm-a.mm);
      return a.m3+r*(b.m3-a.m3);
    }
  }
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

function actualizarStockUI(){
  const idx=isotanqueActualIndex();
  const stockActual=stockPorIsotanque[idx]||0;

  document.getElementById("stockIsotanque").textContent=
    `Stock isotanque seleccionado: ${stockActual.toFixed(2)} m³`;

  document.getElementById("saldoRestante").textContent=
    `Stock a bordo: ${totalBordo().toFixed(2)} m³`;
}

function persistirStock(){
  localStorage.setItem("stockPorIsotanque", JSON.stringify(stockPorIsotanque));
}

// =====================
// TOTAL INICIAL AUTOMÁTICO Y SINCRONIZADO
// =====================
function actualizarCargaTotalInicialUI(valor){
  const input=document.getElementById("cargaTotalInicial");
  input.value=valor>0?valor.toFixed(2):"";
}

function recalcularTotalInicial(){

  // Si ya hay stock confirmado no recalculamos
  if(totalBordo()>0) return;

  const cargas=[
    Number(document.getElementById("saldoIso1").value)||0,
    Number(document.getElementById("saldoIso2").value)||0,
    Number(document.getElementById("saldoIso3").value)||0,
    Number(document.getElementById("saldoIso4").value)||0
  ];

  const total=cargas.reduce((acc,n)=>acc+n,0);

  // 🔥 ACTUALIZAMOS ESTADO INTERNO
  stockPorIsotanque=cargas;

  actualizarCargaTotalInicialUI(total);
  actualizarStockUI();
}

// =====================
// CALCULO
// =====================
function actualizar(){
  const A=interpolar(document.getElementById("nivelA").value);
  const B=interpolar(document.getElementById("nivelB").value);

  document.getElementById("m3A").textContent=
    typeof A==="number"?`Equivalente: ${A.toFixed(2)} m³`:
    A==="fuera"?"Nivel fuera de tabla":"—";

  document.getElementById("m3B").textContent=
    typeof B==="number"?`Equivalente: ${B.toFixed(2)} m³`:
    B==="fuera"?"Nivel fuera de tabla":"—";

  if(typeof A==="number"&&typeof B==="number"){
    ultimoTotal=Math.abs(A-B);
    document.getElementById("resultado").textContent=
      `Total descargado: ${ultimoTotal.toFixed(2)} m³`;
  }else{
    ultimoTotal=0;
    document.getElementById("resultado").textContent="Total descargado: —";
  }
}

// =====================
// REGISTRAR DESCARGA
// =====================
function registrarDescarga(volumen,tipo){

  const activeCampaign=getActiveCampaign();
  if(!activeCampaign) return alert("Debes iniciar campaña primero");

  const centro=document.getElementById("centro").value.trim();
  if(!centro) return alert("Debes ingresar un centro.");

  const idx=isotanqueActualIndex();
  const isotanqueN=idx+1;
  const stockActual=stockPorIsotanque[idx]||0;

  if(volumen<=0) return;

  let volumenFinal=volumen;
  if(volumenFinal>stockActual){
    if(!confirm("La descarga supera stock. ¿Cerrar isotanque?")) return;
    volumenFinal=stockActual;
  }

  stockPorIsotanque[idx]=Math.max(0,stockActual-volumenFinal);
  persistirStock();
  actualizarStockUI();

  historial.push({
    campaignId:activeCampaign.id,
    centro,
    isotanque:isotanqueN,
    tipo,
    volumen:volumenFinal,
    fecha:new Date().toISOString().split("T")[0]
  });

  localStorage.setItem("historialDescargas", JSON.stringify(historial));
}

// =====================
// BOTONES
// =====================
function registrarPorTramo(){
  registrarDescarga(ultimoTotal,"tramo");
}

function descargarIsotanqueCompleto(){
  const idx=isotanqueActualIndex();
  const stockActual=stockPorIsotanque[idx]||0;
  if(stockActual<=0) return;
  if(!confirm("Descarga completa?")) return;
  registrarDescarga(stockActual,"completa");
}

// =====================
// EVENTOS
// =====================
document.getElementById("nivelA").addEventListener("input",actualizar);
document.getElementById("nivelB").addEventListener("input",actualizar);
document.getElementById("isotanqueSelect").addEventListener("change",actualizarStockUI);
document.getElementById("registrar").addEventListener("click",registrarPorTramo);
document.getElementById("descargaCompleta").addEventListener("click",descargarIsotanqueCompleto);

document.getElementById("saldoIso1").addEventListener("input",recalcularTotalInicial);
document.getElementById("saldoIso2").addEventListener("input",recalcularTotalInicial);
document.getElementById("saldoIso3").addEventListener("input",recalcularTotalInicial);
document.getElementById("saldoIso4").addEventListener("input",recalcularTotalInicial);
