useEffect(() => {
  fetch('https://mi-api-externa.com/datos')
    .then(res => res.json())
    .then(data => setDatos(data));
}, []);


