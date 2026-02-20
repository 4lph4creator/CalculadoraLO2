// TABLA REAL ISOTANQUE
const tabla = [
  { mm: 0, m3: 0 },
  { mm: 2, m3: 4.2 },
  { mm: 50, m3: 75.6 },
  { mm: 100, m3: 213.36 },
  { mm: 200, m3: 608.16 },
  { mm: 300, m3: 1119.72 },
  { mm: 400, m3: 1720.32 },
  { mm: 500, m3: 2394.84 },
  { mm: 600, m3: 3129 },
  { mm: 700, m3: 3913.56 },
  { mm: 800, m3: 4739.28 },
  { mm: 880, m3: 5423.04 },
  { mm: 900, m3: 5596.92 },
  { mm: 1000, m3: 6479.76 },
  { mm: 1060, m3: 7019.04 },
  { mm: 1100, m3: 7381.08 },
  { mm: 1200, m3: 8293.32 },
  { mm: 1300, m3: 9209.76 },
  { mm: 1400, m3: 10124.52 },
  { mm: 1500, m3: 11030.88 },
  { mm: 1600, m3: 11922.12 },
  { mm: 1700, m3: 12790.68 },
  { mm: 1800, m3: 13629 },
  { mm: 1900, m3: 14430.36 },
  { mm: 2000, m3: 15185.52 },
  { mm: 2100, m3: 15884.4 },
  { mm: 2200, m3: 16515.24 },
  { mm: 2300, m3: 17063.76 },
  { mm: 2360, m3: 17334.32 },
  { mm: 2400, m3: 17508.12 },
  { mm: 2410, m3: 17556 }
];

// LIMITES FISICOS
const MIN_MM = tabla[0].mm;
const MAX_MM = tabla[tabla.length - 1].mm;

// INTERPOLACION
function interpolar(mm) {
  if (mm === "" || isNaN(mm)) return null;

  mm = Number(mm);

  // VALIDACION RANGO
  if (mm < MIN_MM || mm > MAX_MM) return "OUT";

  if (mm === MIN_MM) return tabla[0].m3;
  if (mm === MAX_MM) return tabla[tabla.length - 1].m3;

  for (let i = 0; i < tabla.length - 1; i++) {
    let a = tabla[i];
    let b = tabla[i + 1];

    if (mm >= a.mm && mm <= b.mm) {
      let ratio = (mm - a.mm) / (b.mm - a.mm);
      return a.m3 + ratio * (b.m3 - a.m3);
    }
  }
}

// ELEMENTOS UI
const nivelA = document.getElementById("nivelA");
const nivelB = document.getElementById("nivelB");
const m3A = document.getElementById("m3A");
const m3B = document.getElementById("m3B");
const resultado = document.getElementById("resultado");
const saldoCampana = document.getElementById("saldoCampana");

// SALDO INICIAL (editable por operador)
let saldoInicial = 0;

// SI EXISTE INPUT DE SALDO
const saldoInput = document.querySelector("input#saldoInicial");
if (saldoInput) {
  saldoInput.addEventListener("input", () => {
    saldoInicial = parseFloat(saldoInput.value) || 0;
    saldoCampana.textContent = saldoInicial.toFixed(2) + " m³";
  });
}

// CALCULO
function actualizar() {
  let A = nivelA.value;
  let B = nivelB.value;

  let valA = interpolar(A);
  let valB = interpolar(B);

  // MOSTRAR A
  if (valA === "OUT") {
    m3A.textContent = "Fuera de rango";
  } else if (valA === null) {
    m3A.textContent = "—";
  } else {
    m3A.textContent = `Equivalente: ${valA.toFixed(2)} m³`;
  }

  // MOSTRAR B
  if (valB === "OUT") {
    m3B.textContent = "Fuera de rango";
  } else if (valB === null) {
    m3B.textContent = "—";
  } else {
    m3B.textContent = `Equivalente: ${valB.toFixed(2)} m³`;
  }

  // CALCULO DESCARGA
  if (
    valA !== null &&
    valB !== null &&
    valA !== "OUT" &&
    valB !== "OUT"
  ) {
    let total = Math.abs(valA - valB);
    resultado.textContent = `Total descargado: ${total.toFixed(2)} m³`;

    let saldoRestante = saldoInicial - total;
    saldoCampana.textContent = saldoRestante.toFixed(2) + " m³";

  } else {
    resultado.textContent = "Total descargado: —";
  }
}

// EVENTOS
nivelA.addEventListener("input", actualizar);
nivelB.addEventListener("input", actualizar);
