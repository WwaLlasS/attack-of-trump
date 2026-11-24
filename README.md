# Attack of Trump

[![Phaser 4](https://img.shields.io/badge/Engine-Phaser%204.2.1-blue.svg)](https://phaser.io/)
[![JavaScript](https://img.shields.io/badge/Language-Vanilla%20JS%20(ES6+)-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-orange.svg)](https://wwallass.github.io/attack-of-trump/)

Shoot 'em up arcade estilo *Space Invaders* con Trump como enemigo. Corre en el navegador, tanto en móvil como en escritorio, con controles táctiles, teclado y por inclinación del dispositivo.

🎮 **Jugar en vivo:** [https://wwallass.github.io/attack-of-trump/](https://wwallass.github.io/attack-of-trump/)

---

## 🕹️ Cómo jugar

Sobrevive a oleadas de enemigos que bajan disparando contra tu sombrero. Cada enemigo derribado suma **20 puntos** y cada oleada superada da **200 puntos** de bonificación. Tienes **3 vidas**; al perderlas todas, la partida termina y puedes guardar tu nombre en la tabla de récords (top 10).

| Acción | Escritorio | Móvil / Tablet |
| :--- | :--- | :--- |
| **Mover nave** | Teclas `←` `→` o `A` / `D` | Inclinar el dispositivo |
| **Disparar** | Tecla `Espacio` (mantener = ráfaga) | Tocar la pantalla (mantener = ráfaga) |
| **Menús** | Flechas / `Enter` / `Espacio` o clic | Tocar los botones |

> **Sensores móviles:** la inclinación requiere HTTPS (o `localhost`). En iOS el juego pide permiso para usar el giroscopio al primer toque.

---

## 🔄 Cambios de esta versión

- Migrado de **Phaser 2.6.2** (con Cordova) a **Phaser 4.2.1**, usando escenas de Phaser 4.
- Estructura web en la raíz del repositorio, lista para GitHub Pages.
- Puntuaciones guardadas en `localStorage` (top 10).
- Manifest PWA para instalarlo en la pantalla de inicio.
- El antiguo proyecto de Cordova (`config.xml`, `platforms/`, `plugins/`, claves `.keystore`) se conserva fuera del repositorio.

---

## 💻 Instalación y desarrollo local

El juego carga imágenes, sonidos y fuentes por HTTP, así que necesita un servidor local (abrir el `index.html` directamente no funciona).

```bash
git clone https://github.com/WwaLlasS/attack-of-trump.git
cd attack-of-trump
npm start        # abre http://localhost:8083
```

Sin Node, también sirve Python:

```bash
python3 -m http.server 8083
```

### Publicar en GitHub Pages

```bash
npm run deploy   # copia los archivos web a .deploy/ y los publica en la rama gh-pages
```

Después, en **Settings → Pages**, elige la rama `gh-pages` y la carpeta `/ (root)`.

---

## 📁 Estructura del proyecto

```
├── index.html                 # Punto de entrada y orden de carga de scripts
├── manifest.webmanifest       # Manifiesto PWA
├── package.json               # Scripts: start y deploy
├── css/
│   ├── style.css              # Página a pantalla completa
│   └── PressStart2P-Regular.woff2
├── js/
│   ├── main.js                # Arranque de Phaser (escalado FIT, escenas)
│   ├── config.js              # Tamaño lógico (414×736), constantes y helpers
│   ├── scores.js              # Tabla de récords en localStorage
│   ├── tilt.js                # Control por inclinación (acelerómetro)
│   └── scenes/
│       ├── preload.js         # Carga de assets y animaciones
│       ├── menu.js            # Menú principal
│       ├── game.js            # Partida: jugador, oleadas, disparos, colisiones
│       ├── gameover.js        # Fin de partida y guardado del nombre
│       └── highscores.js      # Tabla de récords
├── lib/
│   └── phaser.min.js          # Phaser 4.2.1
└── assets/
    ├── img/                   # Sprites, fondo, botones
    ├── sound/                 # Efectos y música
    └── icons/                 # Iconos PWA y favicon
```

---

## 🛠️ Tecnologías

* **[Phaser 4](https://phaser.io/)** (v4.2.1): motor 2D para HTML5. Gestiona el bucle de juego, las escenas, el escalado de pantalla y el audio.
* **JavaScript vanilla (ES6+)**: sin bundlers ni pasos de compilación.
* **Colisiones por rectángulos** (`getBounds`) entre balas, enemigos y nave.
* **DeviceMotion API**: control por inclinación con permiso explícito en iOS.
* **localStorage**: récords guardados en el navegador del jugador.

---

## 📄 Licencia

Proyecto educativo y de entretenimiento. Los assets gráficos y de sonido son propiedad de KondoSoft.
