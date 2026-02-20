// ============================
// TABLA REAL ISOTANQUE
// ============================
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

// ============================
// INTERPOLACIÓN
// ============================
function interpolar(mm) {

  if (mm === "" || isNaN(mm)) return null;

  mm = Number(mm);

  const min = tabla[0].mm;
  const max = tabla[tabla.length - 1].mm;

  if (mm < min || mm > max) return "fuera";

  for (let i = 0; i < tabla.length - 1; i++) {

    let a = tabla[i];
    let b = tabla[i + 1];

    if (mm >= a.mm && mm <= b.mm) {

      let ratio = (mm - a.mm) / (b.mm - a.mm);
      return a.m3 + ratio * (b.m3 - a.m3);

    }
  }
}

// ============================
// ACTUALIZAR UI
// ============================
function actualizar() {

  const saldoCampana = Number(document.getElementById("saldoCampana").value);
  const A = document.getElementById("nivelA").value;
  const B = document.getElementById("nivelB").value;

  const m3A = interpolar(A);
  const m3B = interpolar(B);

  const msg = document.getElementById("mensajeError");
  msg.textContent = "";

  // ----- VALIDACIÓN A -----
  if (m3A === "fuera") {
    document.getElementById("m3A").textContent = "Fuera de rango";
    msg.textContent = "Nivel fuera de tabla";
  } else if (m3A === null) {
    document.getElementById("m3A").textContent = "—";
  } else {
    document.getElementById("m3A").textContent = `Equivalente: ${m3A.toFixed(2)} m³`;
  }

  // ----- VALIDACIÓN B -----
  if (m3B === "fuera") {
    document.getElementById("m3B").textContent = "Fuera de rango";
    msg.textContent = "Nivel fuera de tabla";
  } else if (m3B === null) {
    document.getElementById("m3B").textContent = "—";
  } else {
    document.getElementById("m3B").textContent = `Equivalente: ${m3B.toFixed(2)} m³`;
  }

  // ----- CÁLCULO DESCARGA -----
  if (typeof m3A === "number" && typeof m3B === "number") {

    const total = Math.abs(m3A - m3B);
    document.getElementById("resultado").textContent =
      `Total descargado: ${total.toFixed(2)} m³`;

    // saldo restante NO usa validación tabla
    if (!isNaN(saldoCampana)) {
      const restante = saldoCampana - total;
      document.getElementById("saldoRestante").textContent =
        `Saldo restante: ${restante.toFixed(2)} m³`;
    }

  } else {

    document.getElementById("resultado").textContent = "Total descargado: —";
    document.getElementById("saldoRestante").textContent = "Saldo restante: —";

  }

  // ----- Mostrar saldo campaña -----
  if (!isNaN(saldoCampana)) {
    document.getElementById("saldoMostrado").textContent =
      `Saldo inicial: ${saldoCampana.toFixed(2)} m³`;
  } else {
    document.getElementById("saldoMostrado").textContent = "—";
  }

}

// ============================
// EVENTOS
// ============================
document.getElementById("nivelA").addEventListener("input", actualizar);
document.getElementById("nivelB").addEventListener("input", actualizar);
document.getElementById("saldoCampana").addEventListener("input", actualizar);
