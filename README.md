
# Modulo de Gestión de Usuarios

Este repositorio de PELICULAS-BACK contiene un módulo básico para la gestión de usuarios, desarrollado en Node.js. Incluye funcionalidades para registro, inicio de sesión, actualización, eliminación, y obtención de usuarios con validaciones avanzadas y mejores prácticas.

## **Descripción de las Funciones Principales**

### 1. **Inicio de sesión (`login`)**
Permite a un usuario autenticarse en el sistema.
- **Rate Limiting**: Limita a 10 intentos en un período de 15 minutos para evitar ataques de fuerza bruta.
- **Validación**: Se valida la combinación `username` y contraseña utilizando `bcrypt`.
- **JWT**: Genera un token con una validez de 1 hora.

#### **Ejemplo de uso:**
```bash
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

### 2. **Creación de Usuario (`createUser`)**
Crea un nuevo usuario en el sistema.
- **Validación previa**: Usa un esquema Zod para validar los campos `username`, `email` y `password`.
- **Prevención de duplicados**: Verifica si el `username` o `email` ya están registrados.
- **Cifrado**: La contraseña se almacena como un hash utilizando `bcrypt`.

#### **Ejemplo de uso:**
```bash
POST /users
Content-Type: application/json

{
  "username": "janedoe",
  "email": "jane.doe@example.com",
  "password": "securePassword!"
}
```

### 3. **Actualización de Usuario (`updateUser`)**
Actualiza la información de un usuario existente.
- **Validación dinámica**: Permite actualizar solo los campos proporcionados en la solicitud.
- **Hash de contraseña**: Si se proporciona una nueva contraseña, esta se cifra antes de almacenarse.
- **Control dinámico de SQL**: Construye la consulta SQL en base a los campos recibidos.

#### **Ejemplo de uso:**
```bash
PUT /users/1
Content-Type: application/json

{
  "email": "new.email@example.com",
  "password": "newPassword123"
}
```

### 4. **Eliminación de Usuario (`deleteUser`)**
Elimina un usuario del sistema.
- **Validación de existencia**: Retorna un mensaje si el usuario no existe.

#### **Ejemplo de uso:**
```bash
DELETE /users/1
```

### 5. **Obtención de Usuarios (`getAllUsers`)**
Recupera una lista de usuarios con paginación.
- **Paginación**: Los parámetros `limit` y `page` controlan el número de resultados y la página correspondiente.
- **Protección de datos sensibles**: Retorna solo los campos permitidos.

#### **Ejemplo de uso:**
```bash
GET /users?limit=5&page=2
```

### 6. **Obtención de Usuario por ID (`getUserById`)**
Obtiene información detallada de un usuario específico.
- **Validación de existencia**: Retorna un mensaje si el usuario no es encontrado.

#### **Ejemplo de uso:**
```bash
GET /users/1
```

---

## **Dependencias Utilizadas**
1. `bcrypt`: Manejo de contraseñas (hash y comparación).
2. `zod`: Validación de datos de entrada.
3. `express-rate-limit`: Protección contra ataques de fuerza bruta.
4. `jsonwebtoken`: Generación de tokens JWT.
5. `mysql2`: Conexión y consultas a la base de datos.

---

## **Ejemplo de Configuración**
### Variables de entorno requeridas:
- `JWT_SECRET`: Clave secreta para generar tokens.
- Configuración de conexión a la base de datos en `db`.

---

## **Cómo Ejecutar**
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar las variables de entorno.
3. Iniciar el servidor:
   ```bash
   npm start
   ```

---

## **Mejoras Implementadas**
- Protección contra ataques de fuerza bruta en el inicio de sesión.
- Validación de entrada con esquemas predefinidos (Zod).
- Hash seguro de contraseñas utilizando `bcrypt`.
- Manejo genérico de errores con respuestas claras.

---

## **Contribución**
Cualquier mejora, corrección de errores o sugerencia es bienvenida. ¡Gracias por contribuir!
