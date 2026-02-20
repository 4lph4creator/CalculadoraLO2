// =====================
// TABLA ISOTANQUE
// =====================
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

// =====================
// ESTADO CAMPAÑA
// =====================
let saldoActual = 0;
let ultimoTotal = 0;

// =====================
// INTERPOLACIÓN
// =====================
function interpolar(mm) {
  if (mm === "" || isNaN(mm)) return null;

  mm = Number(mm);

  if (mm < tabla[0].mm || mm > tabla[tabla.length - 1].mm) {
    return "fuera";
  }

  for (let i = 0; i < tabla.length - 1; i++) {
    let a = tabla[i];
    let b = tabla[i + 1];

    if (mm >= a.mm && mm <= b.mm) {
      let r = (mm - a.mm) / (b.mm - a.mm);
      return a.m3 + r * (b.m3 - a.m3);
    }
  }
}

// =====================
// ACTUALIZAR CALCULO
// =====================
function actualizar() {
  const A = document.getElementById("nivelA").value;
  const B = document.getElementById("nivelB").value;
  const msg = document.getElementById("mensaje");

  const m3A = interpolar(A);
  const m3B = interpolar(B);

  msg.textContent = "";

  // NIVEL A
  if (m3A === "fuera") {
    document.getElementById("m3A").textContent = "Nivel fuera de tabla";
  } else {
    document.getElementById("m3A").textContent =
      m3A !== null ? `Equivalente: ${m3A.toFixed(2)} m³` : "—";
  }

  // NIVEL B
  if (m3B === "fuera") {
    document.getElementById("m3B").textContent = "Nivel fuera de tabla";
  } else {
    document.getElementById("m3B").textContent =
      m3B !== null ? `Equivalente: ${m3B.toFixed(2)} m³` : "—";
  }

  // TOTAL
  if (typeof m3A === "number" && typeof m3B === "number") {
    ultimoTotal = Math.abs(m3A - m3B);
    document.getElementById("resultado").textContent =
      `Total descargado: ${ultimoTotal.toFixed(2)} m³`;
  } else {
    ultimoTotal = 0;
    document.getElementById("resultado").textContent = "Total descargado: —";
  }
}

// =====================
// REGISTRAR DESCARGA
// =====================
function registrar() {
  const saldoInput = document.getElementById("saldoInicial").value;

  if (saldoActual === 0) {
    saldoActual = Number(saldoInput);
  }

  if (!ultimoTotal || ultimoTotal === 0) {
    document.getElementById("mensaje").textContent =
      "No hay descarga válida para registrar";
    return;
  }

  saldoActual -= ultimoTotal;

  document.getElementById("saldoRestante").textContent =
    `Saldo restante: ${saldoActual.toFixed(2)} m³`;

  // limpiar niveles
  document.getElementById("nivelA").value = "";
  document.getElementById("nivelB").value = "";
  document.getElementById("m3A").textContent = "—";
  document.getElementById("m3B").textContent = "—";
  document.getElementById("resultado").textContent = "Total descargado: —";
}

// =====================
// EVENTOS
// =====================
document.getElementById("nivelA").addEventListener("input", actualizar);
document.getElementById("nivelB").addEventListener("input", actualizar);
document.getElementById("registrar").addEventListener("click", registrar);
