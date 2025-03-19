## Ejecución 

Crear un .env.local con las siguientes variables de entorno:

```
UDER_CREDENTIAL=
TRAELOYA_CREDENTIAL=
```

En la terminal:

```
npm run dev
```

## Consideraciones

- Stack: NextJS + Typescript + CSSModules + eslint.
- Para almacenamiento solo se utiliza localStorage (sobre sessionStorage por persistencia), en front, como emulador de una bbdd pues son pocos datos. De todas formas, cuando se requiera almacenar en back, se emula el envío de los datos a este servidor, pero no se realiza ninguna acción con ellos (ej: api/customer-data).
- Datos en localStorage: (cartProducts), datos de envío (userData), resultados de la cotización (shippingResponse).
- Se ocupan de forma parcial o completa reglas de clean code como: funciones con una responsabilidad, nombres de variables descriptivos, casi nulidad de comentarios en código.
- El codigo posee un archivo httpsAgent.js y llama a fetch from 'node-fetch'. Esfuerzo que proviene de la motivación por desactivar la verificación de certificados SSL al realizar fetch sobre las apis de traeloya y uder. Si el certificado fue reparado, se puede eliminar este archivo y la dependencia de node-fetch.


## Supuestos

- Se usa cssModules sobre tailwindcss pues se asume la app será altamente frecuentada por usuarios que acceden desde un dispositivo móvil. Tailwind me parece menos ordenado cuando las vistas requieren ese nivel de responsividad, lo que podría ser un problema cuando la app se complejice.
- Se asume que el usuario no puede modificar la cantidad de productos en el carrito, solo puede eliminarlo completo una vez creado.
- Se pueden crear tantos carritos como se desee, pero solo se puede tener uno activo a la vez y estos no se concatenan.


## No implementado y mejoras 

- Front: Botones volver y limpiar carrito como íconos. Formulario de botón ingresa tus datos que este en reemplazo del botón en vista checkout, eliminando vista CustomerData. Homogenizar un poco más el diseño (tamaño fuentes). 
- Back: base de dato para almacenar datos de envío del usuario siempre que también se incorpore manejo de sesiones.