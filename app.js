// Tabla oficial mm → m3
const tabla = {
0:0,
2:4.2,
50:75.6,
100:213.36,
200:608.16,
300:1119.72,
400:1720.32,
500:2394.84,
600:3129,
700:3913.56,
800:4739.28,
880:5423.04,
900:5596.92,
1000:6479.76,
1060:7019.04,
1100:7381.08,
1200:8293.32,
1300:9209.76,
1400:10124.52,
1500:11030.88,
1600:11922.12,
1700:12790.68,
1800:13629,
1900:14430.36,
2000:15185.52,
2100:15884.4,
2200:16515.24,
2300:17063.76,
2360:17334.32,
2400:17508.12,
2410:17556
};

const niveles = Object.keys(tabla).map(Number).sort((a,b)=>a-b);

function interpolar(mm){
    if(tabla[mm]!==undefined) return tabla[mm];

    let menor=null, mayor=null;

    for(let i=0;i<niveles.length;i++){
        if(niveles[i]<mm) menor=niveles[i];
        if(niveles[i]>mm){mayor=niveles[i];break;}
    }

    if(menor===null || mayor===null) return 0;

    const fraccion=(mm-menor)/(mayor-menor);
    return tabla[menor]+fraccion*(tabla[mayor]-tabla[menor]);
}

function actualizar(){
    const a=parseFloat(document.getElementById("nivelA").value);
    const b=parseFloat(document.getElementById("nivelB").value);

    if(!isNaN(a)){
        document.getElementById("m3A").innerText="Equivalente: "+interpolar(a).toFixed(2)+" m³";
    }

    if(!isNaN(b)){
        document.getElementById("m3B").innerText="Equivalente: "+interpolar(b).toFixed(2)+" m³";
    }
}

function calcular(){
    const a=parseFloat(document.getElementById("nivelA").value);
    const b=parseFloat(document.getElementById("nivelB").value);

    if(isNaN(a)||isNaN(b)){
        alert("Ingrese ambos niveles");
        return;
    }

    if(a<=b){
        alert("Nivel A debe ser mayor que Nivel B");
        return;
    }

    const resultado=interpolar(a)-interpolar(b);

    document.getElementById("resultado").innerText=
        "Total descargado: "+resultado.toFixed(2)+" m³";
}

// listeners para actualización automática
document.addEventListener("DOMContentLoaded",()=>{
    document.getElementById("nivelA").addEventListener("input",actualizar);
    document.getElementById("nivelB").addEventListener("input",actualizar);
});
