# ⚙️ Lol APP - Backend (NestJS)

Este backend actúa como intermediario entre la [Riot Games API](https://developer.riotgames.com/) y una base de datos en **Firebase**, permitiendo obtener y registrar combinaciones de campeones usadas en partidas recientes.

---

## 📦 ¿Qué hace actualmente?

- 🔄 Sirve datos **ya almacenados** en Firebase sobre combinaciones entre campeones.
- 📤 Estos datos están disponibles para el frontend de la aplicación.

---

## ⚙️ ¿Y localmente?

Desde desarrollo local (no subido aún al repo/productivo), el backend también:

1. 🔍 Recibe el **nombre de un jugador**.
2. 📈 Consulta la **API de Riot** para obtener sus últimas partidas.
3. 🧠 Filtra las **últimas 10 partidas ganadas**.
4. 🧩 Extrae las combinaciones de campeones utilizados (bot y mid).
5. 📥 Guarda las combinaciones nuevas en Firebase para futuros accesos rápidos desde producción.

> ⚠️ Estas funciones aún no están disponibles en la versión desplegada (Render) pero están en proceso de integración.


---

## 🧪 Próximos pasos

- Subir y habilitar el endpoint de análisis de partidas desde el backend online.
- Crear protección básica (rate limiting o API key) para evitar abusos.
- Mejorar estructura de datos en Firebase (optimización y relaciones).

---


