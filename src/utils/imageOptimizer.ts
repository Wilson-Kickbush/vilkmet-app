import imageCompression from 'browser-image-compression';

/**
 * Optimiza una imagen manteniendo alta calidad y nitidez
 * @param file Archivo de imagen a optimizar
 * @returns Archivo optimizado
 */
export const optimizeImageForPortfolio = async (file: File): Promise<File> => {
  // Solo optimizar imágenes
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const options = {
    maxSizeMB: 8, // Tamaño máximo 8MB (mantiene calidad)
    maxWidthOrHeight: 1920, // Resolución Full HD
    useWebWorker: true, // Usa Web Worker para no bloquear la UI
    maxIteration: 10, // Más iteraciones para mejor compresión
    exifOrientation: 1, // Mantener orientación EXIF
    fileType: 'image/jpeg', // Convertir a JPEG para mejor compresión
    initialQuality: 0.95, // 95% de calidad (casi sin pérdida)
    alwaysKeepResolution: true, // Mantener resolución original
    preserveExif: true, // Mantener metadatos EXIF (color, perfil, etc.)
    signal: undefined, // No usar AbortSignal
  };

  try {
    console.log(`Optimizando imagen: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    const compressedFile = await imageCompression(file, options);
    
    console.log(`Imagen optimizada: ${compressedFile.name} (${(compressedFile.size / 1024 / 1024).toFixed(2)}MB)`);
    console.log(`Reducción: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);
    
    // Asegurar que el archivo tenga un nombre válido
    const fileName = compressedFile.name || file.name || `image-${Date.now()}.jpg`;
    
    // Crear un nuevo File con el nombre asegurado
    const finalFile = new File([compressedFile], fileName, {
      type: compressedFile.type || 'image/jpeg',
      lastModified: Date.now()
    });
    
    return finalFile;
  } catch (error) {
    console.error('Error optimizando imagen:', error);
    // En caso de error, retornar el archivo original con nombre asegurado
    const fileName = file.name || `image-${Date.now()}.jpg`;
    const finalFile = new File([file], fileName, {
      type: file.type || 'image/jpeg',
      lastModified: Date.now()
    });
    return finalFile;
  }
};

/**
 * Crea una URL de preview optimizada para mostrar en el formulario
 * @param file Archivo de imagen
 * @returns URL del objeto para preview
 */
export const createImagePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Limpia las URLs de preview para evitar memory leaks
 * @param url URL del objeto a limpiar
 */
export const cleanupImagePreview = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};