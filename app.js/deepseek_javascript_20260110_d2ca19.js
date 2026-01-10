// Sistema Principal de Inteligencia para Alarmas en Córdoba
class CordobaSecuritySystem {
    constructor() {
        this.initialize();
    }

    async initialize() {
        try {
            // Cargar datos iniciales
            await this.loadInitialData();
            
            // Inicializar componentes
            this.initializeMap();
            this.initializeNotifications();
            this.initializeSearch();
            this.initializeTabs();
            this.initializeCalendar();
            this.initializeNotes();
            
            // Configurar actualizaciones automáticas
            this.setupAutoRefresh();
            
            // Ocultar pantalla de carga
            setTimeout(() => {
                document.getElementById('loading-overlay').style.display = 'none';
                this.showWelcomeMessage();
            }, 1500);
            
        } catch (error) {
            console.error('Error inicializando sistema:', error);
            this.showError('Error al cargar el sistema');
        }
    }

    async loadInitialData() {
        // Cargar datos de municipios
        this.municipios = window.provinciaData.provincia.municipios;
        this.alertas = window.provinciaData.alertas;
        
        // Simular datos de API
        await this.simulateDataLoading();
        
        // Actualizar estadísticas
        this.updateStats();
    }

    initializeMap() {
        // Configurar mapa de Leaflet
        this.map = L.map('map').setView([37.8882, -4.7794], 10);
        
        // Añadir capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // Añadir marcadores de municipios
        this.addMunicipioMarkers();
        
        // Configurar controles del mapa
        this.setupMapControls();
    }

    addMunicipioMarkers() {
        this.municipios.forEach(municipio => {
            const marker = L.marker(municipio.coordenadas)
                .bindPopup(`
                    <strong>${municipio.nombre}</strong><br>
                    Población: ${municipio.poblacion?.toLocaleString() || 'N/A'}<br>
                    Incidencia: ${municipio.incidencia}/10<br>
                    Prioridad: ${municipio.prioridad}
                `)
                .addTo(this.map);
            
            // Color según prioridad
            if (municipio.prioridad.includes('alta')) {
                marker.setIcon(this.createColoredIcon('#e74c3c'));
            } else if (municipio.prioridad.includes('media')) {
                marker.setIcon(this.createColoredIcon('#f39c12'));
            } else {
                marker.setIcon(this.createColoredIcon('#2ecc71'));
            }
        });
    }

    createColoredIcon(color) {
        return L.divIcon({
            html: `<div style="
                background-color: ${color};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [20, 20],
            className: 'custom-marker'
        });
    }

    setupMapControls() {
        // Zoom in
        document.getElementById('zoom-in').addEventListener('click', () => {
            this.map.zoomIn();
        });
        
        // Zoom out
        document.getElementById('zoom-out').addEventListener('click', () => {
            this.map.zoomOut();
        });
        
        // Localizar usuario
        document.getElementById('locate-me').addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.map.setView([position.coords.latitude, position.coords.longitude], 13);
                });
            }
        });
    }

    initializeNotifications() {
        this.notificationCount = 0;
        this.notificationSound = document.getElementById('notification-sound');
        
        // Botón de notificaciones
        const notificationBtn = document.getElementById('notification-btn');
        const notificationPanel = document.getElementById('notification-panel');
        
        notificationBtn.addEventListener('click', () => {
            notificationPanel.classList.toggle('show');
            this.markNotificationsAsRead();
        });
        
        // Limpiar notificaciones
        document.getElementById('clear-notifications').addEventListener('click', () => {
            this.clearNotifications();
        });
        
        // Simular nuevas alertas (en producción vendría de WebSocket)
        setInterval(() => {
            this.simulateNewAlert();
        }, 30000); // Cada 30 segundos
    }

    simulateNewAlert() {
        const municipios = ['Córdoba', 'Lucena', 'Puente Genil', 'Montilla'];
        const tipos = ['robo', 'intento', 'vandalismo'];
        const municipio = municipios[Math.floor(Math.random() * municipios.length)];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        
        const nuevaAlerta = {
            id: Date.now(),
            tipo: tipo,
            municipio: municipio,
            zona: 'Centro',
            direccion: 'Calle Ejemplo, 123',
            descripcion: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} reportado`,
            fecha: new Date().toISOString(),
            gravedad: tipo === 'robo' ? 'alta' : 'media',
            confirmada: Math.random() > 0.5
        };
        
        this.addNotification(nuevaAlerta);
        this.updateAlertasTab();
    }

    addNotification(alerta) {
        this.notificationCount++;
        this.updateNotificationCounter();
        
        // Reproducir sonido si está habilitado
        if (window.provinciaData.config.sonido) {
            this.notificationSound.currentTime = 0;
            this.notificationSound.play().catch(e => console.log('Error reproduciendo sonido:', e));
        }
        
        // Añadir a la lista
        const notificationList = document.getElementById('notification-list');
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item unread';
        notificationItem.innerHTML = `
            <div class="notification-icon ${alerta.tipo}">
                <i class="fas fa-${alerta.tipo === 'robo' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
            </div>
            <div class="notification-content">
                <h5>${alerta.descripcion}</h5>
                <p>${alerta.municipio} - ${alerta.zona}</p>
                <div class="notification-time">
                    <i class="far fa-clock"></i> Ahora mismo
                </div>
            </div>
        `;
        
        notificationList.insertBefore(notificationItem, notificationList.firstChild);
        
        // Limitar a 50 notificaciones
        if (notificationList.children.length > 50) {
            notificationList.removeChild(notificationList.lastChild);
        }
    }

    updateNotificationCounter() {
        const counter = document.getElementById('notification-count');
        counter.textContent = this.notificationCount;
        counter.style.display = this.notificationCount > 0 ? 'flex' : 'none';
    }

    markNotificationsAsRead() {
        const items = document.querySelectorAll('.notification-item.unread');
        items.forEach(item => {
            item.classList.remove('unread');
        });
    }

    clearNotifications() {
        const notificationList = document.getElementById('notification-list');
        notificationList.innerHTML = '';
        this.notificationCount = 0;
        this.updateNotificationCounter();
    }

    initializeSearch() {
        const searchInput = document.getElementById('main-search');
        const searchBtn = document.getElementById('search-btn');
        
        // Buscar al hacer clic
        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });
        
        // Buscar al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });
        
        // Rellenar selects de municipios
        this.populateMunicipioSelects();
    }

    populateMunicipioSelects() {
        const selects = document.querySelectorAll('select[id*="municipio"], select[id*="zona"]');
        
        selects.forEach(select => {
            // Opción por defecto
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = select.id.includes('filter') ? 'Todos los municipios' : 'Seleccionar municipio';
            select.appendChild(defaultOption);
            
            // Añadir municipios
            this.municipios.forEach(municipio => {
                const option = document.createElement('option');
                option.value = municipio.id;
                option.textContent = municipio.nombre;
                select.appendChild(option);
            });
        });
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        query = query.toLowerCase();
        
        // Buscar en municipios
        const resultadosMunicipios = this.municipios.filter(municipio =>
            municipio.nombre.toLowerCase().includes(query) ||
            municipio.cp.includes(query)
        );
        
        // Buscar en zonas (si las tiene)
        const resultadosZonas = [];
        this.municipios.forEach(municipio => {
            if (municipio.zonas) {
                municipio.zonas.forEach(zona => {
                    if (typeof zona === 'object' && zona.nombre.toLowerCase().includes(query)) {
                        resultadosZonas.push({
                            municipio: municipio.nombre,
                            zona: zona.nombre,
                            incidencia: zona.incidencia
                        });
                    }
                });
            }
        });
        
        // Mostrar resultados
        this.displaySearchResults(resultadosMunicipios, resultadosZonas);
    }

    displaySearchResults(municipios, zonas) {
        // En una versión completa, se mostraría en un modal o panel
        console.log('Resultados de búsqueda:', { municipios, zonas });
        
        // Por ahora, mostramos una alerta
        if (municipios.length > 0 || zonas.length > 0) {
            this.showNotification(
                'success',
                `Encontrados ${municipios.length + zonas.length} resultados`
            );
        } else {
            this.showNotification(
                'info',
                'No se encontraron resultados para tu búsqueda'
            );
        }
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Remover clase active de todos
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanes.forEach(p => p.classList.remove('active'));
                
                // Añadir clase active al seleccionado
                btn.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
                
                // Cargar contenido específico de la pestaña
                this.loadTabContent(tabId);
            });
        });
    }

    loadTabContent(tabId) {
        switch(tabId) {
            case 'alertas':
                this.updateAlertasTab();
                break;
            case 'negocios':
                this.updateNegociosTab();
                break;
            case 'visitas':
                this.updateVisitasTab();
                break;
            case 'notas':
                this.updateNotasTab();
                break;
            case 'analytics':
                this.updateAnalyticsTab();
                break;
        }
    }

    updateAlertasTab() {
        const alertasGrid = document.getElementById('alertas-grid');
        alertasGrid.innerHTML = '';
        
        this.alertas.forEach(alerta => {
            const card = document.createElement('div');
            card.className = `alerta-card ${alerta.gravedad}`;
            card.innerHTML = `
                <div class="alerta-header">
                    <div>
                        <div class="alerta-titulo">${alerta.descripcion}</div>
                        <span class="alerta-municipio">${alerta.municipio}</span>
                    </div>
                    <div class="alerta-gravedad ${alerta.gravedad}">
                        ${alerta.gravedad.toUpperCase()}
                    </div>
                </div>
                <div class="alerta-detalles">
                    <div class="alerta-direccion">
                        <i class="fas fa-map-marker-alt"></i> ${alerta.direccion}
                    </div>
                    <div class="alerta-tiempo">
                        <i class="far fa-clock"></i> ${this.formatTimeAgo(alerta.fecha)}
                    </div>
                </div>
            `;
            alertasGrid.appendChild(card);
        });
    }

    updateNegociosTab() {
        const negociosList = document.getElementById('negocios-list');
        const negocios = window.provinciaData.provincia.nuevosNegocios || [];
        
        negociosList.innerHTML = negocios.map(negocio => `
            <div class="negocio-card">
                <div class="negocio-header">
                    <h4>${negocio.nombre}</h4>
                    <span class="negocio-tipo">${negocio.tipo}</span>
                </div>
                <div class="negocio-info">
                    <div><i class="fas fa-map-marker-alt"></i> ${negocio.municipio}</div>
                    <div><i class="fas fa-home"></i> ${negocio.direccion}</div>
                    <div><i class="fas fa-phone"></i> ${negocio.telefono}</div>
                    <div><i class="fas fa-calendar"></i> Abrió: ${negocio.fecha_apertura}</div>
                </div>
                <div class="negocio-actions">
                    <button class="btn-small" onclick="system.addVisitaFromNegocio(${negocio.id})">
                        <i class="fas fa-calendar-plus"></i> Programar Visita
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        document.getElementById('total-municipios').textContent = this.municipios.length;
        document.getElementById('total-alertas').textContent = this.alertas.length;
        document.getElementById('visitas-programadas').textContent = this.visitas?.length || 0;
        document.getElementById('nuevos-negocios').textContent = 
            window.provinciaData.provincia.nuevosNegocios?.length || 0;
    }

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) {
            return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
        } else {
            return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
        }
    }

    showNotification(type, message) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showWelcomeMessage() {
        this.showNotification(
            'success',
            '¡Sistema de Inteligencia cargado! Monitoreando toda la provincia de Córdoba'
        );
    }

    showError(message) {
        this.showNotification('error', message);
    }

    setupAutoRefresh() {
        if (window.provinciaData.config.autoActualizar) {
            setInterval(() => {
                this.refreshData();
            }, window.provinciaData.config.intervaloActualizacion);
        }
    }

    async refreshData() {
        try {
            // Simular actualización de datos
            await this.simulateDataLoading();
            this.updateStats();
            this.updateLastUpdateTime();
        } catch (error) {
            console.error('Error actualizando datos:', error);
        }
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('update-time').textContent = timeString;
    }

    async simulateDataLoading() {
        // Simular carga de datos
        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    // Métodos para visitas (simplificados)
    initializeCalendar() {
        // Configurar calendario básico
        const today = new Date();
        const calendarEl = document.getElementById('calendar');
        
        // Mostrar fecha actual
        calendarEl.innerHTML = `
            <div class="calendar-header">
                <h4>${today.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</h4>
            </div>
            <div class="calendar-days">
                <!-- Días se llenarían dinámicamente -->
                <div class="calendar-day today">
                    <div class="day-number">${today.getDate()}</div>
                    <div class="day-events">
                        <span class="event-dot"></span>
                    </div>
                </div>
            </div>
        `;
        
        // Configurar modal de visitas
        this.setupVisitaModal();
    }

    setupVisitaModal() {
        const modal = document.getElementById('visita-modal');
        const openBtn = document.getElementById('nueva-visita-modal');
        const closeBtns = modal.querySelectorAll('.modal-close');
        const saveBtn = document.getElementById('save-visita');
        
        openBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            // Establecer fecha mínima como hoy
            document.getElementById('visita-fecha').min = 
                new Date().toISOString().split('T')[0];
        });
        
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        });
        
        saveBtn.addEventListener('click', () => {
            this.saveVisita();
            modal.style.display = 'none';
        });
        
        // Cerrar al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    saveVisita() {
        const visita = {
            cliente: document.getElementById('visita-cliente').value,
            municipio: document.getElementById('visita-municipio').value,
            fecha: document.getElementById('visita-fecha').value,
            hora: document.getElementById('visita-hora').value,
            direccion: document.getElementById('visita-direccion').value,
            motivo: document.getElementById('visita-motivo').value,
            notas: document.getElementById('visita-notas').value
        };
        
        // Guardar visita
        if (!window.provinciaData.visitas) {
            window.provinciaData.visitas = [];
        }
        window.provinciaData.visitas.push({
            ...visita,
            id: Date.now(),
            estado: 'programada'
        });
        
        this.showNotification('success', 'Visita programada correctamente');
        this.updateStats();
    }

    // Métodos para notas (simplificados)
    initializeNotes() {
        const nuevaNotaBtn = document.getElementById('nueva-nota');
        const saveNotaBtn = document.getElementById('save-nota');
        
        nuevaNotaBtn.addEventListener('click', () => {
            this.clearNoteEditor();
        });
        
        saveNotaBtn.addEventListener('click', () => {
            this.saveNote();
        });
        
        // Cargar notas guardadas
        this.loadNotes();
    }

    clearNoteEditor() {
        document.getElementById('nota-title').value = '';
        document.getElementById('nota-content').value = '';
        document.getElementById('nota-category').value = 'general';
    }

    saveNote() {
        const nota = {
            titulo: document.getElementById('nota-title').value,
            contenido: document.getElementById('nota-content').value,
            categoria: document.getElementById('nota-category').value,
            fecha: new Date().toISOString(),
            id: Date.now()
        };
        
        if (!nota.titulo.trim()) {
            this.showNotification('error', 'El título es obligatorio');
            return;
        }
        
        // Guardar nota
        if (!window.provinciaData.notas) {
            window.provinciaData.notas = [];
        }
        window.provinciaData.notas.push(nota);
        
        this.updateNotasTab();
        this.clearNoteEditor();
        this.showNotification('success', 'Nota guardada correctamente');
    }

    loadNotes() {
        this.updateNotasTab();
    }

    updateNotasTab() {
        const notasList = document.getElementById('notas-list');
        const notas = window.provinciaData.notas || [];
        
        if (notas.length === 0) {
            notasList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <p>No hay notas guardadas</p>
                    <p>Crea tu primera nota haciendo clic en "Nueva Nota"</p>
                </div>
            `;
            return;
        }
        
        notasList.innerHTML = notas.map(nota => `
            <div class="nota-item" data-category="${nota.categoria}">
                <div class="nota-header">
                    <h5>${nota.titulo}</h5>
                    <span class="nota-category ${nota.categoria}">${nota.categoria}</span>
                </div>
                <div class="nota-content">${nota.contenido.substring(0, 150)}...</div>
                <div class="nota-footer">
                    <span class="nota-date">${new Date(nota.fecha).toLocaleDateString()}</span>
                    <button class="btn-icon" onclick="system.editNote(${nota.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    editNote(id) {
        const nota = window.provinciaData.notas.find(n => n.id === id);
        if (nota) {
            document.getElementById('nota-title').value = nota.titulo;
            document.getElementById('nota-content').value = nota.contenido;
            document.getElementById('nota-category').value = nota.categoria;
            
            // Cambiar el botón de guardar para editar
            const saveBtn = document.getElementById('save-nota');
            saveBtn.dataset.editing = id;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar Nota';
        }
    }

    // Método para añadir visita desde negocio
    addVisitaFromNegocio(negocioId) {
        const negocio = window.provinciaData.provincia.nuevosNegocios
            .find(n => n.id === negocioId);
        
        if (negocio) {
            // Rellenar formulario de visita
            document.getElementById('visita-cliente').value = negocio.nombre;
            // Buscar ID del municipio
            const municipioSelect = document.getElementById('visita-municipio');
            const municipioOption = Array.from(municipioSelect.options)
                .find(opt => opt.text === negocio.municipio);
            if (municipioOption) {
                municipioSelect.value = municipioOption.value;
            }
            document.getElementById('visita-direccion').value = negocio.direccion;
            
            // Abrir modal
            document.getElementById('visita-modal').style.display = 'block';
        }
    }
}

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.system = new CordobaSecuritySystem();
    
    // Configurar actualización de hora
    setInterval(() => {
        const now = new Date();
        document.getElementById('update-time').textContent = 
            now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }, 60000); // Actualizar cada minuto
});