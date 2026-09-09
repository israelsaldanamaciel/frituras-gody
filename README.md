# frituras-gody
Catalogo de Frituras Gody

## Generar APK

1. Instala Node.js LTS y Android Studio con Android SDK y Platform-Tools.
2. Abre esta carpeta en una terminal y ejecuta:

```powershell
npm install
npm run android:add
npm run android:build
```

3. El APK de prueba se generara en:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

Para abrir el proyecto en Android Studio usa:

```powershell
npm run android:open
```
