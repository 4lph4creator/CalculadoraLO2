// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {

  // Tabla oficial isotanque
  const tabla = [
    {mm:0, L:0},
    {mm:2, L:5},
    {mm:50, L:90},
    {mm:100, L:254},
    {mm:200, L:724},
    {mm:300, L:1333},
    {mm:400, L:2048},
    {mm:500, L:2851},
    {mm:600, L:3725},
    {mm:700, L:4659},
    {mm:800, L:5642},
    {mm:900, L:6663},
    {mm:1000, L:7774},
    {mm:1100, L:8787},
    {mm:1200, L:9873},
    {mm:1300, L:10964},
    {mm:1400, L:12053},
    {mm:1500, L:13132},
    {mm:1600, L:14193},
    {mm:1700, L:15227},
    {mm:1800, L:16225},
    {mm:1900, L:17179},
    {mm:2000, L:18078},
    {mm:2100, L:18910},
    {mm:2200, L:19661},
    {mm:2300, L:20314},
    {mm:2360, L:20848},
    {mm:2400, L:20643},
    {mm:2410, L:20900}
  ];

  // Interpolación lineal
  function litrosDesdeMM(mm){
    if (isNaN(mm)) return null;

    // Exacto
    for(let i=0;i<tabla.length;i++){
      if(tabla[i].mm===mm) return tabla[i].L;
    }

    // Buscar tramo
    for(let i=0;i<tabla.length-1;i++){
      let a=tabla[i];
      let b=tabla[i+1];

      if(mm>a.mm && mm<b.mm){
        let frac=(mm-a.mm)/(b.mm-a.mm);
        return a.L + frac*(b.L-a.L);
      }
    }

    return null;
  }

  // UI
  const nivelA=document.getElementById("nivelA");
  const nivelB=document.getElementById("nivelB");
  const m3A=document.getElementById("m3A");
  const m3B=document.getElementById("m3B");
  const resultado=document.getElementById("resultado");

  function actualizar(){
    if(!nivelA || !nivelB) return;

    let a=parseFloat(nivelA.value);
    let b=parseFloat(nivelB.value);

    let litrosA=litrosDesdeMM(a);
    let litrosB=litrosDesdeMM(b);

    if(litrosA!==null){
      let m3=litrosA*0.001;
      if(m3A) m3A.innerText="Equivalente: "+m3.toFixed(2);
    }else{
      if(m3A) m3A.innerText="—";
    }

    if(litrosB!==null){
      let m3=litrosB*0.001;
      if(m3B) m3B.innerText="Equivalente: "+m3.toFixed(2);
    }else{
      if(m3B) m3B.innerText="—";
    }

    if(litrosA!==null && litrosB!==null){
      let total=(litrosA-litrosB)*0.001;
      if(resultado) resultado.innerText="Total descargado: "+total.toFixed(2);
    }else{
      if(resultado) resultado.innerText="Total descargado: —";
    }
  }

  if(nivelA) nivelA.addEventListener("input", actualizar);
  if(nivelB) nivelB.addEventListener("input", actualizar);

});
