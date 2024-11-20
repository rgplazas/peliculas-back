
# Sistema de Peliculas (Back)

## Modulo de Gestión de Peliculas

Este repositorio de PELICULAS-BACK contiene un módulo completo para la gestión de películas. Desarrollado en Node.js, incluye funcionalidades para la creación, obtención, actualización y eliminación de películas, integrando validaciones avanzadas y mejores prácticas.

### **Descripción de las Funciones Principales**

#### 1. **Creación de Película (`createMovie`)**
Permite agregar una nueva película al sistema.
- **Validación previa**: Usa un esquema Zod para validar campos como `titulo`, `director`, `anio`, y otros.
- **Prevención de duplicados**: Verifica si una película con el mismo título ya existe (opcional según los requerimientos).

##### **Ejemplo de uso:**
```bash
POST /movies
Content-Type: application/json
Authorization: 'Bearer TOKEN'

{
  "titulo": "Inception",
  "titulo_original": "Inception",
  "director": "Christopher Nolan",
  "anio": 2010,
  "sinopsis": "Una historia sobre sueños dentro de sueños.",
  "imagen_url": "https://example.com/inception.jpg",
  "duracion": 148,
  "pais": "EE.UU.",
  "trailer_url": "https://youtube.com/example",
  "fecha_estreno": "2010-07-16",
  "usuario_id": 1
} 

```

#### 2. **Obtención de Películas (`getAllMovies`)**
Recupera una lista de películas con soporte para paginación.
- **Paginación**: Controlada por los parámetros limit y page.
- **Filtros opcionales**: Se pueden aplicar filtros como director, anio, o titulo.

##### **Ejemplo de uso:**
```bash
GET /movies?limit=5&page=2&director=Christopher%20Nolan
```

#### 3. **Obtención de Película por ID (`getMovieById`)**
Obtiene información detallada de una película específica.
- **Validación de existencia**: Retorna un mensaje si la película no se encuentra.

##### **Ejemplo de uso:**
```bash
GET /movies/1
```

#### 4. **Actualización de Película (`updateMovie`)**
Actualiza la información de una película existente.
- **Validación dinámica**: Permite actualizar solo los campos proporcionados en la solicitud.
- **Prevención de errores**: Asegura que la película especificada exista antes de actualizarla.

##### **Ejemplo de uso:**
```bash
PUT /movies/1
Content-Type: application/json
Authorization: 'Bearer TOKEN'

{
  "titulo": "Inception (Updated)",
  "sinopsis": "Un thriller de ciencia ficción renovado."
}

```

#### 5. **Eliminación de Película (`deleteMovie`)**
Elimina una película del sistema.
- **Validación de existencia**: Retorna un mensaje si la película no se encuentra.

##### **Ejemplo de uso:**
```bash
DELETE /movies/1
Authorization: 'Bearer TOKEN'
```

## Modulo de Gestión de Usuarios

Este repositorio de PELICULAS-BACK contiene un módulo básico para la gestión de usuarios, desarrollado en Node.js. Incluye funcionalidades para registro, inicio de sesión, actualización, eliminación, y obtención de usuarios con validaciones avanzadas y mejores prácticas.

### **Descripción de las Funciones Principales**

#### 1. **Inicio de sesión (`login`)**
Permite a un usuario autenticarse en el sistema.
- **Rate Limiting**: Limita a 10 intentos en un período de 15 minutos para evitar ataques de fuerza bruta.
- **Validación**: Se valida la combinación `username` y contraseña utilizando `bcrypt`.
- **JWT**: Genera un token con una validez de 1 hora.

##### **Ejemplo de uso:**
```bash
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

#### 2. **Creación de Usuario (`createUser`)**
Crea un nuevo usuario en el sistema.
- **Validación previa**: Usa un esquema Zod para validar los campos `username`, `email` y `password`.
- **Prevención de duplicados**: Verifica si el `username` o `email` ya están registrados.
- **Cifrado**: La contraseña se almacena como un hash utilizando `bcrypt`.

##### **Ejemplo de uso:**
```bash
POST /users
Content-Type: application/json
Authorization: 'Bearer TOKEN'

{
  "username": "janedoe",
  "email": "jane.doe@example.com",
  "password": "securePassword!"
}
```

#### 3. **Actualización de Usuario (`updateUser`)**
Actualiza la información de un usuario existente.
- **Validación dinámica**: Permite actualizar solo los campos proporcionados en la solicitud.
- **Hash de contraseña**: Si se proporciona una nueva contraseña, esta se cifra antes de almacenarse.
- **Control dinámico de SQL**: Construye la consulta SQL en base a los campos recibidos.

##### **Ejemplo de uso:**
```bash
PUT /users/1
Content-Type: application/json
Authorization: 'Bearer TOKEN'

{
  "email": "new.email@example.com",
  "password": "newPassword123"
}
```

#### 4. **Eliminación de Usuario (`deleteUser`)**
Elimina un usuario del sistema.
- **Validación de existencia**: Retorna un mensaje si el usuario no existe.

##### **Ejemplo de uso:**
```bash
DELETE /users/1
Authorization: 'Bearer TOKEN'
```

#### 5. **Obtención de Usuarios (`getAllUsers`)**
Recupera una lista de usuarios con paginación.
- **Paginación**: Los parámetros `limit` y `page` controlan el número de resultados y la página correspondiente.
- **Protección de datos sensibles**: Retorna solo los campos permitidos.

##### **Ejemplo de uso:**
```bash
GET /users?limit=5&page=2
Authorization: 'Bearer TOKEN'
```

#### 6. **Obtención de Usuario por ID (`getUserById`)**
Obtiene información detallada de un usuario específico.
- **Validación de existencia**: Retorna un mensaje si el usuario no es encontrado.

##### **Ejemplo de uso:**
```bash
GET /users/1
Authorization: 'Bearer TOKEN'
```

---

### **Dependencias Utilizadas**
1. `bcrypt`: Manejo de contraseñas (hash y comparación).
2. `zod`: Validación de datos de entrada.
3. `express-rate-limit`: Protección contra ataques de fuerza bruta.
4. `jsonwebtoken`: Generación de tokens JWT.
5. `mysql2`: Conexión y consultas a la base de datos.

---

### **Ejemplo de Configuración**
#### Variables de entorno requeridas:
- `JWT_SECRET`: Clave secreta para generar tokens.
- Configuración de conexión a la base de datos en `db`.

---

### **Cómo Ejecutar**
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

### **Mejoras Implementadas**
- Protección contra ataques de fuerza bruta en el inicio de sesión.
- Validación de entrada con esquemas predefinidos (Zod).
- Hash seguro de contraseñas utilizando `bcrypt`.
- Manejo genérico de errores con respuestas claras.

---

### **Contribución**
Cualquier mejora, corrección de errores o sugerencia es bienvenida. ¡Gracias por contribuir!
