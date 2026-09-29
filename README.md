# Pista Lenta

Prueba técnica Full-Stack con temática de carreras de caracoles. Incluye autenticación local, dashboard de resultados y un flujo de carga de saldo conectado al API mock SnailPay.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación

Instala cada proyecto por separado:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Ejecución

Inicia el backend:

```bash
cd backend
npm run dev
```

El API queda disponible en `http://localhost:3001`.

En otra terminal, inicia el frontend:

```bash
cd frontend
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

Los valores de entorno opcionales están documentados en los archivos `.env.example` de cada proyecto.

## Verificación

```bash
cd backend
npm run typecheck
npm test
npm run build

cd ../frontend
npm run typecheck
npm run build
```

## Arquitectura

El frontend está organizado por páginas, componentes, contexto de autenticación, servicios, tipos, utilidades y estilos. `AuthContext` mantiene el estado de sesión en memoria y delega la persistencia a `storage.service`. El acceso a SnailPay está centralizado en su propio servicio.

El backend separa configuración, rutas, controladores, servicio de dominio, validaciones con Zod, tipos y middleware de errores. No utiliza base de datos y no persiste información.

## Autenticación y persistencia

La prueba admite una sola cuenta por navegador. El usuario, la sesión, el saldo y las respuestas de SnailPay se almacenan en LocalStorage.

La contraseña no se guarda en texto plano. Se deriva en el navegador mediante PBKDF2 con SHA-256, un salt aleatorio de 16 bytes y 120,000 iteraciones. Es una medida razonable para esta simulación local, pero una aplicación real debe autenticar en un servidor y usar un algoritmo de hashing de contraseñas como Argon2id o bcrypt.

## Casos de SnailPay

Endpoint: `POST /api/snailpay/charges`.

### Operación aprobada

- Número: `1234123412341234`
- Vencimiento: `12/26`
- CVV: `543`
- Nombre: cualquier texto no vacío
- Monto: mayor a `0` y hasta `100000`
- Respuesta HTTP: `201`
- `status`: `approved`
- `status_detail`: `accredited`

### Operación rechazada

Utiliza cualquier combinación válida que no coincida con todos los datos de aprobación. Por ejemplo, cambia el CVV a `111`.

- Respuesta HTTP: `422`
- `status`: `rejected`
- `status_detail`: `card_data_mismatch`

### Error interno deliberado

Utiliza un número válido de 16 dígitos terminado en `0000`, por ejemplo `1234123412340000`.

- Respuesta HTTP: `500`
- `status`: `error`
- `status_detail`: `internal_service_error`

Los rechazos y errores nunca modifican el saldo.

## Contrato

Todas las respuestas de transacción incluyen:

```json
{
  "id": "uuid",
  "status": "approved | rejected | error",
  "status_detail": "string",
  "transaction_amount": 250,
  "date_created": "ISO-8601",
  "authorization_code": "string | null",
  "reference": "string",
  "payer_id": "uuid",
  "payer_email": "correo@ejemplo.com",
  "card_number": "1234123412341234",
  "cvv": "543"
}
```

Por requisito explícito de la prueba, el número completo de tarjeta y el CVV ficticios se incluyen en la respuesta y se almacenan en LocalStorage. Esto es inseguro y está prohibido en una aplicación real: nunca se debe persistir el CVV ni almacenar datos completos de tarjeta fuera de una infraestructura certificada.

## Decisiones de alcance

- Las gráficas utilizan datos simulados fijos y consistentes.
- Existen exactamente seis caracoles y la suma de sus victorias es seis.
- No hay apuestas, ejecución de carreras, pagos reales, recuperación de contraseña ni administración de usuarios.
- El saldo solamente cambia cuando SnailPay responde con una operación aprobada.
