function toggleProject(projectId) {
    const content = document.getElementById('content-' + projectId);
    const icon = document.getElementById('icon-' + projectId);

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.classList.remove('rotated');
    } else {
        // Cerrar otros proyectos abiertos
        document.querySelectorAll('.project-content.expanded').forEach(el => {
            el.classList.remove('expanded');
        });
        document.querySelectorAll('.expand-icon.rotated').forEach(el => {
            el.classList.remove('rotated');
        });

        // Abrir el proyecto seleccionado
        content.classList.add('expanded');
        icon.classList.add('rotated');
    }
}