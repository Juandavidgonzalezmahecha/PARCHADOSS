// Prototipo básico: aquí conectaremos Firebase luego
console.log("PARCHADOSS prototype loaded");

document.getElementById('btn-login').addEventListener('click', ()=>{
  alert('Aquí irá la autenticación con Firebase.');
});

document.getElementById('btn-plan-rapido').addEventListener('click', ()=>{
  const out = document.getElementById('plan-result');
  out.innerHTML = '<h3>Plan rápido de ejemplo</h3><p>Paseo corto + café</p>';
});
