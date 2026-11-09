# Documentación de D’ Victor Fragancias

- [Mapa del proyecto](MAPA-PROYECTO.md): funcionalidades, archivos, estado y reglas actuales.
- [Arquitectura y carpetas](ARQUITECTURA.md): conexiones y ubicación de cada área.
- [Verificación](VERIFICACION.md): comprobaciones de la reorganización.

## Instalación y ejecución

Usar Node.js 22.12 o superior y ejecutar desde la raíz del repositorio:

```bash
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

`dev` sirve la tienda en http://localhost:3000. `lint` comprueba los tipos de
TypeScript. `build` genera `dist/` en la raíz, y `preview` permite revisar ese
resultado localmente. Para desplegar el frontend estático, publicar el contenido
de `dist/` después de ejecutar `npm run build` desde la raíz.

`npm run clean` elimina únicamente las salidas generadas `dist/` y `server.js`
de la raíz, y funciona en Windows, macOS y Linux. No existe actualmente un
servidor compilado: se conserva la limpieza de `server.js` del comando anterior.

Las dependencias se administran en un único `package.json` y `package-lock.json`.
No hace falta instalar paquetes por separado dentro de las carpetas.

## Variables de entorno y origen

Vite sigue leyendo los archivos `.env*` desde la raíz. La aplicación actual no
necesita una clave de Gemini ni una conexión a base de datos para funcionar.
`DISABLE_HMR=true` mantiene el comportamiento existente de desactivar HMR y la
vigilancia de archivos. Los archivos `.env*` permanecen ignorados por Git, salvo
`.env.example`.

El proyecto procede de [Google AI Studio](https://ai.studio/apps/16debea3-4fad-4f13-a6bb-19be1df63e4b).
Sus metadatos originales se conservan en `Frontend/metadata.json`; la declaración
de capacidad Gemini no implica que haya una integración implementada.
