# Preparcial Web - Internacionalizacion (i18n)

Proyecto de preparcial de Desarrollo Web enfocado en internacionalizacion con Next.js 16 (App Router), soporte multilingue (espanol e ingles), deteccion de idioma con Proxy y persistencia mediante cookies.

---

## Archivos y conceptos esenciales para el parcial

Para entender rapidamente como esta resuelto cada punto del examen:

### 1. Deteccion y redireccion automatica (proxy.ts)
- Ubicacion: `preparcial/proxy.ts`
- Que hace: Intercepta las solicitudes antes de que lleguen a las paginas.
  - Revisa si el usuario ya tiene guardada una cookie de preferencia (`NEXT_LOCALE`).
  - Si no hay cookie, revisa el idioma preferido configurado en el navegador mediante la cabecera `Accept-Language`.
  - Si la URL no tiene prefijo de idioma (por ejemplo entra a `/` o `/profile`), lo redirige automaticamente a `/${locale}` o `/${locale}/profile`.
  - Si la ruta ya tiene prefijo (`/es` o `/en`), deja continuar la peticion normalmente.

### 2. Diccionarios de traduccion (dictionaries/es.json y en.json)
- Ubicacion: `preparcial/dictionaries/es.json` y `preparcial/dictionaries/en.json`
- Que hace: Contienen las traducciones estructuradas con llaves identicas en ambos idiomas.
  - Incluyen las llaves obligatorias solicitadas: `"welcome"` y `"profile"`.
  - Ningun texto de la interfaz esta quemado (hardcodeado) en el codigo; todo se lee desde estos archivos.

### 3. Carga asincrona en el servidor (lib/dictionaries.ts)
- Ubicacion: `preparcial/lib/dictionaries.ts`
- Que hace: Define la funcion `getDictionary(locale)` que importa dinamicamente el archivo JSON correspondiente segun el idioma.
  - Utiliza `import 'server-only'` para asegurar que los diccionarios solo se lean en el servidor y no aumenten el peso del JavaScript que se envia al navegador.

### 4. Layout con atributo lang dinamico (app/[lang]/layout.tsx)
- Ubicacion: `preparcial/app/[lang]/layout.tsx`
- Que hace: Es el layout principal de la aplicacion.
  - Recibe el parametro de ruta `params` de forma asincrona (`const { lang } = await params`).
  - Define la etiqueta `<html lang={lang}>` de manera dinamica segun la ruta actual (`es` o `en`).
  - Renderiza la barra de navegacion con el selector de idioma.

### 5. Paginas y consumo del diccionario (app/[lang]/page.tsx)
- Ubicacion: `preparcial/app/[lang]/page.tsx` y `preparcial/app/[lang]/profile/page.tsx`
- Que hace: Son Server Components.
  - Llaman a `await getDictionary(lang)` y utilizan las llaves como `{dict.welcome}` y `{dict.profile}`.

### 6. Persistencia de idioma en el cliente (components/LanguageSwitcher.tsx)
- Ubicacion: `preparcial/components/LanguageSwitcher.tsx`
- Que hace: Es un Client Component (`'use client'`).
  - Al seleccionar un idioma, guarda una cookie llamada `NEXT_LOCALE` con vigencia de 1 ano.
  - Cambia la URL reemplazando el segmento de idioma (por ejemplo de `/es/profile` a `/en/profile`).
  - El proxy lee esta cookie en futuras visitas para recordar el idioma elegido.

### 7. Ejemplo de API Route para el parcial (app/api/items/route.ts)
- Ubicacion: `preparcial/app/api/items/route.ts`
- Que hace: Un Route Handler didactico con explicaciones comentadas:
  - Como responder con formato JSON mediante `NextResponse.json()`.
  - Como leer parametros en la URL (`request.nextUrl.searchParams.get()`).
  - Metodos `GET` y `POST`.
  - Codigo de ejemplo comentado sobre como consumir una API externa con documentacion libre si el profesor lo solicita en el examen.

---

## Estructura de carpetas

```text
PREPARCIAL 1 WEB/
├── preparcial_web.pdf              # Enunciado del preparcial (ignorado por git)
├── README.md                       # Esta guia
├── .gitignore                      # Reglas de exclusion de git
└── preparcial/                     # Proyecto Next.js 16
    ├── app/
    │   ├── [lang]/
    │   │   ├── layout.tsx          # html lang dinamico y navegacion
    │   │   ├── page.tsx            # Pagina principal (welcome)
    │   │   └── profile/
    │   │       └── page.tsx        # Pagina de perfil (profile)
    │   ├── api/
    │   │   └── items/
    │   │       └── route.ts        # Ejemplo didactico de API
    │   └── globals.css             # Estilos visuales
    ├── components/
    │   └── LanguageSwitcher.tsx    # Selector interactivo y cookie
    ├── dictionaries/
    │   ├── es.json                 # Diccionario en espanol
    │   └── en.json                 # Diccionario en ingles
    ├── lib/
    │   └── dictionaries.ts         # Carga asincrona server-only
    ├── proxy.ts                    # Proxy de deteccion y redireccion
    ├── package.json
    └── tsconfig.json
```

---

## Como ejecutar el proyecto

1. Abrir la terminal y entrar a la carpeta del proyecto:
   ```bash
   cd preparcial
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   - http://localhost:3000
   - El sistema detectara el idioma y redirigira a `/es` o `/en`.
