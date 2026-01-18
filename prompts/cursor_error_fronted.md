# Error de construcción por dependencia babel
_Exported on 1/18/2026 at 19:51:32 GMT+1 from Cursor (2.3.35)_

---

**User**

Al ejecutar npm run build, después de ejecutar npm install en @frontend/ , tengo este error y no progresa.

npm run build

> frontend@0.1.0 build
> react-scripts build

Creating an optimized production build...
One of your dependencies, babel-preset-react-app, is importing the
"@babel/plugin-proposal-private-property-in-object" package without
declaring it in its dependencies. This is currently working because
"@babel/plugin-proposal-private-property-in-object" is already in your
node_modules folder for unrelated reasons, but it may break at any time.

babel-preset-react-app is part of the create-react-app project, which
is not maintianed anymore. It is thus unlikely that this bug will
ever be fixed. Add "@babel/plugin-proposal-private-property-in-object" to
your devDependencies to work around this error. This will make this message
go away.


¿Puedes ayudarme a arreglarlo?

---

**Cursor**


Revisando `package.json` del frontend para agregar la dependencia faltante.



Agregando `@babel/plugin-proposal-private-property-in-object` en `devDependencies` para resolver el warning de Babel.


```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.97",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "bootstrap": "^5.3.3",
    "dotenv": "^16.4.5",
    "react": "^18.3.1",
    "react-bootstrap": "^2.10.2",
    "react-bootstrap-icons": "^1.11.4",
    "react-datepicker": "^6.9.0",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "jest --config jest.config.js",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}

```


Agregado `@babel/plugin-proposal-private-property-in-object` en `devDependencies` de `package.json`. Instalando dependencias:



He agregado la dependencia faltante `@babel/plugin-proposal-private-property-in-object` en la sección `devDependencies` del `package.json`.

Para resolver el problema:

1. Ejecuta `npm install` en el directorio `frontend` para instalar la nueva dependencia.
2. Luego ejecuta `npm run build` nuevamente.

Este warning es un problema conocido con `babel-preset-react-app` (parte de create-react-app), que no está mantenido. Agregar esta dependencia explícitamente es la solución recomendada.

Después de instalar, el build debería funcionar sin ese warning.

