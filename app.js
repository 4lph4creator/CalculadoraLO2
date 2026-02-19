// Factor conversión mmH2O → m³
const FACTOR = 7.59276;

// Inputs
const inputA = document.getElementById("nivelA");
const inputB = document.getElementById("nivelB");

// Outputs
const eqA = document.getElementById("m3A");
const eqB = document.getElementById("m3B");
const resultado = document.getElementById("resultado");

// Función principal
function actualizar() {

    const valorA = inputA.value;
    const valorB = inputB.value;

    let m3A = null;
    let m3B = null;

    // ===== NIVEL A =====
    if (valorA !== "") {
        m3A = parseFloat(valorA) * FACTOR;
        eqA.textContent = "Equivalente: " + m3A.toFixed(2) + " m³";
    } else {
        eqA.textContent = "—";
    }

    // ===== NIVEL B =====
    if (valorB !== "") {
        m3B = parseFloat(valorB) * FACTOR;
        eqB.textContent = "Equivalente: " + m3B.toFixed(2) + " m³";
    } else {
        eqB.textContent = "—";
    }

    // ===== TOTAL =====
    if (m3A !== null && m3B !== null) {
        const total = m3A - m3B;
        resultado.textContent = "Total descargado: " + total.toFixed(2) + " m³";
    } else {
        resultado.textContent = "Total descargado: —";
    }
}

// Eventos automáticos
inputA.addEventListener("input", actualizar);
inputB.addEventListener("input", actualizar);

// Ejecutar una vez al cargar
actualizar();
