/* Configuración del sitio. Después de cambiar algo aquí, ejecuta:  node build.mjs  */
export const SITE = {
  url: "https://mundonin.cl",
  name: "Mundonin",
  locale: "es_CL",

  /* Catálogo en otra plataforma. Vacío = "catálogo pendiente".
     Al pegar el enlace, aparecen los botones "Ver catálogo" en todo el sitio. */
  catalogUrl: "",

  /* Contacto y local (también se usa en los datos estructurados para Google) */
  waNumber: "56952890171",
  phoneDisplay: "+56 9 5289 0171",
  phoneTel: "+56952890171",
  streetAddress: "Feria Modelo de Ovalle, pasillo naranja, local 45",
  city: "Ovalle",
  region: "Región de Coquimbo",
  hoursText: "lunes, miércoles, viernes y sábado, de 9:30 a 17:00",
  hoursShort: "Lun, mié, vie y sáb de 9:30 a 17:00",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Feria+Modelo+de+Ovalle",

  /* Suscripciones (opcionales) */
  brevoFormUrl: "",      // enlace del formulario de Brevo
  waChannelUrl: "",      // enlace al canal de WhatsApp

  /* Club */
  clubPrice: 4990,
  clubPayUrl: "",        // enlace de cobro (Mercado Pago o Flow)
  clubCancelUrl: "",     // enlace para darse de baja

  cats: ["Peluches","Animales","Juegos de mesa","Autos y carritos","Muñecas","Mochilas","Librería"]
};
