## Spec Dashboard Layout

## General layout

- Referencia visual: `codex/assets/design/dashboard/layout/layout.png`.

- Todos los componentes deben usar Mantine UI, debe reutilizarse todo lo que se pueda de la libreria.
- Todos los componentes que requieren estilos que no estan en Mantine UI deben usar css Modules.
- Debe usar el layout flex por defecto, va a tener un navbar arriba y un sidebar a la izquierda.
- Debe el layout contener un contenedor general llamado app. Este contendra toda la aplicacion.
- Debe el layout estar a nivel general de Dashboard page de next16, es decir debe ser el layout de toda la pagina menos de la seccion de panel admin.

.app {
display: flex;
min-height: 100vh;
}

## Navbar

1. El navbar debe tener una posicion sticky con un z-index elevado mas grande que el contenido del contenedor que esta dentro del contenedor general.
2. El navbar debe mantener una position en top 0.
3. Al scrollear el contenido el navbar debe actuar como el sidebar no debe moverse de su posicion.

.navbbar {
height: var(--header-h);
background: white;
border-bottom: 1px solid var(--gray-2);
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 20px;
position: sticky;
top: 0;
z-index: 50;
}

## Sidebar

1. El sidbebar debe estructurarse usando componentes de mantine UI. En caso de no tener para un estilo o propiedad especifica se procedera a usar CSS Modules.
2. El sidebar debe remplazar el svg que esta en la estructura que te voy a dar por el mismo logo que se uso en el panel de Admin.
3. El sidebar esta compuesto por 4 subitems que deben ser paginas independientes cada una.
4. Cada item del sidebar debe estar dentro del routing del mismo. Por ahora estos items usaran rutas estaticas de next16.
5. Si bien debemos agregar todos los items del sidebar con sus respectivos nombres, nos vamos a enfocar en trabajar solo en el de gestion de lotes.
6. Padron unificado que es el primer item debe tener un active como el del codigo proporcionado. Es decir su estado inicial debe estar reflejado por un active.
7. El estado inicial sera el primer item del sidebar remarcado.
8. Los espaciados del sidebar deben ser tal cual los solicitados en la estructura proporcionada.
9. El sidebar debe incluir en el pie de pagina el nombre del usuario, su cargo y el avatar.
10. El sidebar esta dividido en 2 menus con subitems. El primer menu del sidebar debe tener el titulo de `Análisis` debe contener 3 items.
11. El segundo titulo perteneciente al segundo menu del sidebar debe ser `Seguimiento` este submenu debe contener un item el de reprocesamiento.
12. El sidebar debe mantener una posicion fija a las izquierda. De momento este sidebar no debe ser scrolleable.

```<aside class="sidebar">

<div class="sb-logo">
<svg width="36" height="36" viewBox="0 0 54 57" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
<path d="M53.8197 30.8199C53.8197 43.5199 42.7897 56.4899 27.4697 56.4899C22.3197 56.4899 18.5397 55.1599 17.6497 52.3099C17.5497 51.9699 17.3197 51.4999 17.8597 51.7299C19.9497 52.6299 22.6697 53.0199 25.6497 53.0199C38.9397 53.0199 51.5997 41.6399 51.5997 27.5799C51.5997 22.7199 50.1597 18.1799 47.6297 14.3799C51.5997 18.6199 53.8197 23.7299 53.8197 30.8199Z" fill="#99E0F7"></path><path d="M0 26.52C0 12.73 11.75 0 25.62 0C32.54 0 36.99 1.55 38.21 5.55C38.62 6.96 38.31 7.42 37.82 7.08C34.62 4.8 31.02 3.67001 25.95 3.67001C12.76 3.67001 2.44 13.76 2.44 27.06C2.44 34.83 6.21 41.86 12.12 46.25C5.04 41.75 0 34.85 0 26.52Z" fill="#008BD2"></path><path d="M5.02051 27.4202C5.02051 14.8502 15.2105 4.66016 27.7805 4.66016C40.3505 4.66016 50.5405 14.8502 50.5405 27.4202C50.5405 39.9902 40.3505 50.1802 27.7805 50.1802C15.2105 50.1802 5.02051 39.9902 5.02051 27.4202Z" fill="url(#sbpaint0)"></path><path d="M7.46973 13.4199C12.0997 6.95994 18.0097 5.68994 25.6197 5.68994C34.5997 5.68994 40.5397 10.5499 40.5397 18.5599C40.5397 24.4899 36.6597 28.3499 31.9997 29.7099L42.1197 45.8599C40.4197 47.2199 39.1397 47.4199 37.2397 47.4199C33.7397 47.4199 31.8497 46.0599 30.0097 42.9499L22.8397 31.6999H18.1397V42.0799H7.46973V13.4199Z" fill="url(#sbpaint1)"></path><path d="M7.46973 12.4203C11.6897 6.89027 17.3497 5.28027 25.3197 5.28027C34.6997 5.28027 39.6397 9.92027 39.6397 17.9303C39.6397 23.8603 35.5597 27.8203 31.3497 29.0203L41.7297 45.6203C40.6497 46.3203 38.9497 46.6203 37.0497 46.6203C33.5497 46.6203 32.0497 45.4603 30.0097 42.1503L21.9397 30.7003H16.5697V41.3803H7.46973V12.4203Z" fill="url(#sbpaint2)"></path><path d="M16.5703 15.8203V23.5903H23.3703C26.4703 23.5903 28.3003 21.6803 28.3003 19.3503C28.3003 16.7103 26.4103 15.8203 22.7903 15.8203H16.5703Z" fill="url(#sbpaint3)"></path>
<defs>
<linearGradient id="sbpaint0" x1="27.78" y1="4.72" x2="27.78" y2="50.22" gradientUnits="userSpaceOnUse"><stop stop-color="#009EE0"></stop><stop offset="1" stop-color="#005782"></stop></linearGradient>
<linearGradient id="sbpaint1" x1="24.8" y1="5.32" x2="24.8" y2="47.42" gradientUnits="userSpaceOnUse"><stop stop-color="#BCBEC0"></stop><stop offset="1" stop-color="#939598"></stop></linearGradient>
<linearGradient id="sbpaint2" x1="24.6" y1="5.28" x2="24.6" y2="46.62" gradientUnits="userSpaceOnUse"><stop stop-color="#F9F9F9"></stop><stop offset="1" stop-color="#D1D3D4"></stop></linearGradient>
<linearGradient id="sbpaint3" x1="22.43" y1="15.82" x2="22.43" y2="23.62" gradientUnits="userSpaceOnUse"><stop stop-color="#81CFF4"></stop><stop offset="1" stop-color="#0074A6"></stop></linearGradient>
</defs>
</svg>
<div><div class="sb-text">Inteligencia Fiscal</div><div class="sb-sub">DGR Jujuy</div></div>
</div>
<nav class="sb-nav">
<div class="sb-label">Análisis</div>
<div class="sb-item active" id="nav-padron" onclick="showView('padron')">
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
Padrón Unificado
</div>
<div class="sb-item" id="nav-lotes" onclick="showView('lotes')">
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect></svg>
Gestión de Lotes
</div>
<div class="sb-item" id="nav-tablero" onclick="showView('tablero')">
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
Gestión de Cruces
</div>
<div class="sb-label" style="margin-top:8px">Seguimiento</div>
<div class="sb-item" id="nav-reproceso" onclick="showView('reproceso')">
<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
Reproceso
</div>
</nav>
<div class="sb-footer">
<div class="user-row">
<div class="avatar">NG</div>
<div><div style="font-size:12px;font-weight:600">Nadia Guzmán</div><div style="font-size:10.5px;color:var(--gray-5)">Analista Fiscal</div></div>
</div>
</div>

  </aside>
```
