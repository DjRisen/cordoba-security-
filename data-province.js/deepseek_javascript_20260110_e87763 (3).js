// Datos COMPLETOS de la provincia de Córdoba
const provinciaCordoba = {
    totalMunicipios: 71,
    municipios: [
        {
            id: 1,
            nombre: "Córdoba",
            tipo: "capital",
            poblacion: 322071,
            cp: "14001-14014",
            coordenadas: [37.8882, -4.7794],
            incidencia: 8.5,
            prioridad: "alta",
            zonas: [
                { nombre: "Centro Histórico", incidencia: 9.2 },
                { nombre: "Sector Sur", incidencia: 8.7 },
                { nombre: "Norte", incidencia: 6.3 },
                { nombre: "Este", incidencia: 7.1 },
                { nombre: "Oeste", incidencia: 5.8 }
            ]
        },
        {
            id: 2,
            nombre: "Lucena",
            tipo: "ciudad",
            poblacion: 42648,
            cp: "14900",
            coordenadas: [37.4088, -4.4852],
            incidencia: 7.2,
            prioridad: "alta",
            zonas: ["Centro", "Polígono Industrial", "Barriadas"]
        },
        {
            id: 3,
            nombre: "Puente Genil",
            tipo: "ciudad",
            poblacion: 29618,
            cp: "14500",
            coordenadas: [37.3894, -4.7669],
            incidencia: 6.8,
            prioridad: "media-alta"
        },
        {
            id: 4,
            nombre: "Montilla",
            tipo: "ciudad",
            poblacion: 23243,
            cp: "14550",
            coordenadas: [37.5867, -4.6383],
            incidencia: 6.5,
            prioridad: "media"
        },
        {
            id: 5,
            nombre: "Priego de Córdoba",
            tipo: "ciudad",
            poblacion: 22260,
            cp: "14800",
            coordenadas: [37.4381, -4.1953],
            incidencia: 6.1,
            prioridad: "media"
        },
        {
            id: 6,
            nombre: "Cabra",
            tipo: "ciudad",
            poblacion: 20239,
            cp: "14940",
            coordenadas: [37.4725, -4.4425],
            incidencia: 6.3,
            prioridad: "media"
        },
        {
            id: 7,
            nombre: "Baena",
            tipo: "ciudad",
            poblacion: 19353,
            cp: "14850",
            coordenadas: [37.6167, -4.3167],
            incidencia: 5.9,
            prioridad: "media-baja"
        },
        // ... Continuaría con los 71 municipios
    ],
    
    // Datos de incidencia por tipo
    tiposIncidencia: {
        "robo_vivienda": 35,
        "robo_negocio": 28,
        "vandalismo": 20,
        "intento_robo": 12,
        "otros": 5
    },
    
    // Zonas de alta prioridad (Top 20)
    zonasCalientes: [
        { municipio: "Córdoba", zona: "Centro Histórico", incidencia: 9.2 },
        { municipio: "Córdoba", zona: "Sector Sur", incidencia: 8.7 },
        { municipio: "Lucena", zona: "Polígono Industrial", incidencia: 8.1 },
        { municipio: "Puente Genil", zona: "Centro", incidencia: 7.8 },
        { municipio: "Montilla", zona: "Barriada Norte", incidencia: 7.5 }
    ],
    
    // Negocios de nueva apertura (ejemplo)
    nuevosNegocios: [
        {
            id: 1,
            nombre: "Restaurante La Alhambra",
            tipo: "restaurante",
            municipio: "Córdoba",
            direccion: "C/ Reyes Católicos, 24",
            cp: "14001",
            fecha_apertura: "2024-01-15",
            telefono: "957123456",
            potencial: "alto"
        },
        {
            id: 2,
            nombre: "Electrodomésticos Tecnohogar",
            tipo: "comercio",
            municipio: "Lucena",
            direccion: "Av. de Andalucía, 12",
            cp: "14900",
            fecha_apertura: "2024-01-10",
            telefono: "957654321",
            potencial: "medio-alto"
        }
        // ... más negocios
    ]
};

// Datos de alertas en tiempo real (simuladas)
const alertasEnVivo = [
    {
        id: 1,
        tipo: "robo",
        municipio: "Córdoba",
        zona: "Centro Histórico",
        direccion: "C/ Claudio Marcelo",
        descripcion: "Robo en vivienda",
        fecha: new Date().toISOString(),
        gravedad: "alta",
        confirmada: true
    },
    {
        id: 2,
        tipo: "intento",
        municipio: "Lucena",
        zona: "Polígono Industrial",
        direccion: "Calle de la Industria",
        descripcion: "Intento de robo en nave industrial",
        fecha: new Date(Date.now() - 3600000).toISOString(),
        gravedad: "media",
        confirmada: false
    }
];

// Exportar para uso global
window.provinciaData = {
    provincia: provinciaCordoba,
    alertas: alertasEnVivo,
    visitas: [],
    notas: [],
    config: {
        notificaciones: true,
        sonido: true,
        autoActualizar: true,
        intervaloActualizacion: 300000 // 5 minutos
    }
};