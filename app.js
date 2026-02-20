// Importamos el módulo nativo 'fs' para trabajar con archivos
const fs = require("fs");
// Importamos Yargs para manejar parámetros por línea de comandos
const yargs = require("yargs");
// Ruta del archivo donde guardaremos las tareas
const filePath = "./data/tareas.json";

/**
 * Función para leer las tareas del archivo JSON
 */
function getTareas() {
  if (!fs.existsSync("./data")) fs.mkdirSync("./data");
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");

  const data = fs.readFileSync(filePath, "utf-8");
  // Devolver las tareas aunque el JSON esté corrupto
  try {
    return JSON.parse(data);
  } catch {
    console.error("tareas.json está corrupto. Reiniciando...");
    fs.writeFileSync(filePath, "[]"); // repara el archivo
    return [];
  }
}

/**
 * Función para guardar tareas en el archivo JSON
 */
function saveTareas(tareas) {
  fs.writeFileSync(filePath, JSON.stringify(tareas, null, 2));
}

/**
 * Definimos el comando 'crear'
 */
yargs.command({
  command: "crear",
  describe: "Crea una nueva tarea",

  builder: {
    titulo: {
      describe: "El título de la tarea",
      demandOption: true,
      type: "string",
    },
  },

  handler(argv) {
    if (!argv.titulo || !argv.titulo.trim()) {
      // blindamos para que no se rompa con undefined, .trim
      console.error("El título no puede estar vacío.");
      return;
    }

    try {
      const tareas = getTareas();

      const nuevaTarea = {
        id: Date.now(),
        titulo: argv.titulo,
        completada: false,
      };

      tareas.push(nuevaTarea);
      saveTareas(tareas);

      console.log(`Tarea "${argv.titulo}" creada exitosamente.`);
    } catch (error) {
      console.error("Error:", error.message);
    }
  },
});

// Ejecuta Yargs para procesar los argumentos
yargs.help().parse();