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
let stockBordo = Number(localStorage.getItem("stockBordo")) || 0;
let historial = JSON.parse(localStorage.getItem("historialDescargas")) || [];

// =====================
// INTERPOLAR
// =====================
function interpolar(mm) {
  if (mm === "" || isNaN(mm)) return null;
  mm = Number(mm);
  if (mm < tabla[0].mm || mm > tabla[tabla.length - 1].mm) return "fuera";

  for (let i = 0; i < tabla.length - 1; i++) {
    let a = tabla[i], b = tabla[i + 1];
    if (mm >= a.mm && mm <= b.mm) {
      let r = (mm - a.mm) / (b.mm - a.mm);
      return a.m3 + r * (b.m3 - a.m3);
    }
  }
}

// =====================
// RENDER HISTORIAL
// =====================
function renderHistorial() {
  const cont = document.getElementById("historial");
  cont.innerHTML = "";

  [...historial].reverse().forEach(r => {
    const div = document.createElement("div");
    const fecha = r.fecha.slice(5).split("-").reverse().join("-");
    div.textContent = `${fecha} — ${r.centro} — ${r.volumen.toFixed(0)} m³`;
    cont.appendChild(div);
  });
}

// =====================
// LOAD
// =====================
window.addEventListener("load", () => {

  // restaurar carga total
  const cargaGuardada = localStorage.getItem("saldoInicial");
  if (cargaGuardada !== null) {
    document.getElementById("saldoInicial").value = cargaGuardada;
    document.getElementById("saldoInicial").disabled = true;
  }

  // restaurar stock
  if (stockBordo > 0) {
    document.getElementById("saldoRestante").textContent =
      `Stock a bordo: ${stockBordo.toFixed(2)} m³`;
  }

  renderHistorial();
});

// =====================
// CALCULO
// =====================
function actualizar() {
  const A = interpolar(document.getElementById("nivelA").value);
  const B = interpolar(document.getElementById("nivelB").value);

  document.getElementById("m3A").textContent =
    typeof A === "number" ? `Equivalente: ${A.toFixed(2)} m³` :
    A === "fuera" ? "Nivel fuera de tabla" : "—";

  document.getElementById("m3B").textContent =
    typeof B === "number" ? `Equivalente: ${B.toFixed(2)} m³` :
    B === "fuera" ? "Nivel fuera de tabla" : "—";

  if (typeof A === "number" && typeof B === "number") {
    ultimoTotal = Math.abs(A - B);
    document.getElementById("resultado").textContent =
      `Total descargado: ${ultimoTotal.toFixed(2)} m³`;
  } else {
    ultimoTotal = 0;
    document.getElementById("resultado").textContent = "Total descargado: —";
  }
}

// =====================
// REGISTRAR
// =====================
function registrar() {

  const cargaInicial = Number(document.getElementById("saldoInicial").value);
  const centro = document.getElementById("centro").value.trim();

  // guardar carga total solo una vez
  if (!localStorage.getItem("saldoInicial")) {
    localStorage.setItem("saldoInicial", cargaInicial);
    document.getElementById("saldoInicial").disabled = true;
  }

  // inicializar stock primera vez
  if (!stockBordo) stockBordo = cargaInicial;

  if (!ultimoTotal || !centro) return;

  stockBordo -= ultimoTotal;
  localStorage.setItem("stockBordo", stockBordo);

  const registro = {
    centro,
    volumen: ultimoTotal,
    fecha: new Date().toISOString().slice(0,10)
  };

  historial.push(registro);
  localStorage.setItem("historialDescargas", JSON.stringify(historial));
  renderHistorial();

  document.getElementById("saldoRestante").textContent =
    `Stock a bordo: ${stockBordo.toFixed(2)} m³`;

  document.getElementById("centro").value = "";
  document.getElementById("nivelA").value = "";
  document.getElementById("nivelB").value = "";
  document.getElementById("m3A").textContent = "—";
  document.getElementById("m3B").textContent = "—";
  document.getElementById("resultado").textContent = "Total descargado: —";
}

// =====================
// NUEVA CAMPAÑA
// =====================
function nuevaCampana() {

  localStorage.removeItem("stockBordo");
  localStorage.removeItem("historialDescargas");
  localStorage.removeItem("saldoInicial");

  stockBordo = 0;
  historial = [];

  document.getElementById("saldoInicial").disabled = false;
  document.getElementById("saldoInicial").value = "";
  document.getElementById("saldoRestante").textContent = "Stock a bordo: —";
  renderHistorial();
}

function exportarHistorial() {
  if (!historial.length) return;

  let texto = "Historial descargas LO2\n\n";

  historial.forEach(r => {
    const fecha = r.fecha.slice(5).split("-").reverse().join("-");
    texto += `${fecha} — ${r.centro} — ${r.volumen.toFixed(0)} m³\n`;
  });

  const blob = new Blob([texto], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "historial_LO2.txt";
  a.click();

  URL.revokeObjectURL(url);
}
// =====================
// EVENTOS
// =====================
document.getElementById("nivelA").addEventListener("input", actualizar);
document.getElementById("nivelB").addEventListener("input", actualizar);
document.getElementById("registrar").addEventListener("click", registrar);
document.getElementById("nuevaCampana").addEventListener("click", nuevaCampana);
