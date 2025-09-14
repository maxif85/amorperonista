// Base de datos de efemérides (se cargará desde archivo externo)
let efemerides = {};

// Datos de ejemplo embebidos como respaldo
const efemeridesRespaldo = {
    "1-1": [
        { tipo: "Mundial", evento: "Año Nuevo", descripcion: "Celebración del inicio del nuevo año en el calendario gregoriano" },
        { tipo: "Historia", evento: "Creación de la bandera de Cuba (1902)", descripcion: "Se adopta oficialmente la bandera cubana" },
        { tipo: "Religioso", evento: "Circuncisión de Jesús", descripcion: "Festividad cristiana celebrada ocho días después de Navidad" }
    ]
};

// Función para cargar efemérides desde archivo externo
async function cargarEfemerides() {
    try {
        // Intentar cargar desde archivo JSON externo
        const response = await fetch('efemerides.json');
        if (response.ok) {
            const data = await response.json();
            efemerides = data;
        } else {
            throw new Error('Archivo no encontrado');
        }
    } catch (error) {
        // Si falla, usar datos de respaldo
        efemerides = efemeridesRespaldo;
    }
    
    // Actualizar calendario después de cargar datos
    updateCalendar();
    // Seleccionar automáticamente el día de hoy
    selectTodayByDefault();
}

let currentDate = new Date();
let selectedDay = null;

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('currentMonth').textContent = `${monthNames[month]}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.style.height = '48px';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const dateKey = `${month + 1}-${day}`;
        const hasEvents = efemerides[dateKey];
        
        dayElement.className = `calendar-day ${hasEvents ? 'has-event' : ''}`;
        dayElement.textContent = day;
        dayElement.dataset.day = day;
        dayElement.dataset.dateKey = dateKey;
        
        dayElement.addEventListener('click', () => {
            selectDay(dayElement, dateKey, day, month, year);
        });
        
        calendarGrid.appendChild(dayElement);
    }
}

function selectDay(dayElement, dateKey, day, month, year) {
    // Remover selección anterior
    document.querySelectorAll('.selected-day').forEach(el => {
        el.classList.remove('selected-day');
        if (efemerides[el.dataset.dateKey]) {
            el.classList.add('has-event');
        }
    });
    
    // Agregar nueva selección
    dayElement.classList.add('selected-day');
    dayElement.classList.remove('has-event');
    
    selectedDay = day;
    showEfemerides(dateKey, day, month, year);
}

function selectTodayByDefault() {
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    // Solo seleccionar si estamos viendo el mes actual
    if (currentDate.getFullYear() === todayYear && currentDate.getMonth() === todayMonth) {
        const todayElement = document.querySelector(`[data-day="${todayDay}"]`);
        if (todayElement) {
            const dateKey = `${todayMonth + 1}-${todayDay}`;
            selectDay(todayElement, dateKey, todayDay, todayMonth, todayYear);
        }
    }
}

function showEfemerides(dateKey, day, month, year) {
    const selectedDateElement = document.getElementById('selectedDate');
    const container = document.getElementById('efemeridesContainer');
    
    selectedDateElement.textContent = `${day} de ${monthNames[month]}`;
    
    const dayEfemerides = efemerides[dateKey];
    
    if (dayEfemerides && dayEfemerides.length > 0) {
        container.innerHTML = dayEfemerides.map(efemeride => `
            <div class="efemeride-card p-3 rounded mb-3">
                <div class="d-flex align-items-center mb-2">
                    <span class="badge bg-primary me-3">${efemeride.tipo}</span>
                    <h5 class="fw-bold text-dark mb-0">${efemeride.evento}</h5>
                </div>
                <p class="text-muted mb-0">${efemeride.descripcion}</p>
            </div>
        `).join('');
    } else {
        container.innerHTML = `
            <div class="text-center py-5">
                <div class="display-1 mb-3">📅</div>
                <p class="text-muted">No hay efemérides registradas para esta fecha</p>
                <p class="small text-secondary">¡Pero cada día es especial por sí mismo!</p>
            </div>
        `;
    }
}

// Event listeners
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarEfemerides();
});