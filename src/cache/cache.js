import NodeCache from "node-cache";

const cache = new NodeCache({
    stdTTL: 3600,  // Tiempo de vida estándar de 1 hora
    checkperiod: 600,  // Cada 10 minutos, verificar los elementos expirados
    useClones: false,  // Para no clonar los valores al ser almacenados
    deleteOnExpire: true  // Eliminar elementos cuando expiren
});

export default cache;