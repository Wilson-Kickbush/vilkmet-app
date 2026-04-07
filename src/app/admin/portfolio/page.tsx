"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase, portfolioApi, PortfolioProject } from "@/lib/supabase";
import { optimizeImageForPortfolio, createImagePreview, cleanupImagePreview } from "@/utils/imageOptimizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Upload, 
  Image as ImageIcon, 
  MapPin, 
  Type, 
  FileText, 
  Trash2, 
  Loader2,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
  Camera,
  Zap
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PortfolioAdminPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    type: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
    return () => {
      // Limpiar preview URL al desmontar
      if (previewUrl) {
        cleanupImagePreview(previewUrl);
      }
    };
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await portfolioApi.getProjects();
    
    if (error) {
      setMessage({ type: 'error', text: `Error al cargar proyectos: ${error.message}` });
    } else if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limpiar preview anterior
    if (previewUrl) {
      cleanupImagePreview(previewUrl);
    }

    // Validación de tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Formato de imagen no válido. Solo se aceptan JPG, PNG o WEBP.' });
      e.target.value = ''; // Resetear input
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validación de tamaño (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: `La imagen excede el tamaño máximo de 5MB. Tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)} MB` });
      e.target.value = '';
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Si pasa validación
    setSelectedFile(file);
    const url = createImagePreview(file);
    setPreviewUrl(url);
    setMessage(null); // Limpiar mensajes anteriores
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Por favor, selecciona una imagen' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // 1. OPTIMIZAR IMAGEN ANTES DE SUBIR (NUEVO)
      setMessage({ type: 'success', text: 'Optimizando imagen para máxima nitidez...' });
      const optimizedFile = await optimizeImageForPortfolio(selectedFile);
      
      // 2. Subir imagen optimizada al storage
      setMessage({ type: 'success', text: 'Subiendo imagen optimizada...' });
      const { data: uploadData, error: uploadError } = await portfolioApi.uploadImage(optimizedFile);
      
      if (uploadError) throw new Error(`Error al subir imagen: ${uploadError.message}`);
      
      // 3. Obtener URL pública
      const imageUrl = portfolioApi.getImageUrl(uploadData.path);
      
      // 4. Crear proyecto en la base de datos
      const projectData = {
        title: formData.title,
        location: formData.location,
        description: formData.description,
        type: formData.type,
        image_url: imageUrl,
      };

      setMessage({ type: 'success', text: 'Guardando proyecto en la base de datos...' });
      const { error: createError } = await portfolioApi.createProject(projectData);
      
      if (createError) throw new Error(`Error al crear proyecto: ${createError.message}`);

      // 5. Limpiar formulario y recargar proyectos
      setFormData({ title: "", location: "", description: "", type: "" });
      setSelectedFile(null);
      if (previewUrl) {
        cleanupImagePreview(previewUrl);
        setPreviewUrl(null);
      }
      setMessage({ type: 'success', text: '¡Proyecto creado exitosamente con imagen optimizada en alta definición!' });
      
      // Recargar lista de proyectos
      await loadProjects();
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    setLoading(true);
    const { error } = await portfolioApi.deleteProject(id, imageUrl);
    
    if (error) {
      setMessage({ type: 'error', text: `Error al eliminar: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Proyecto eliminado exitosamente' });
      await loadProjects();
    }
    setLoading(false);
  };

  const projectTypes = [
    "Ventanales",
    "Cerramientos",
    "Puertas Balcón",
    "Fachadas Vidriadas",
    "Cortina Wall",
    "Puertas Principales",
    "Vidrio Térmico",
    "Oficinas",
    "Residencial"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Portfolio</h1>
          <p className="text-gray-600 mt-2">
            Sube y gestiona los proyectos de instalaciones reales de VILKMET
          </p>
        </div>

        {/* Mensajes de estado */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de creación */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nuevo Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input de imagen */}
                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Imagen del Proyecto
                  </Label>
                  
                  {/* Consejos para mejores fotos */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Consejos para máxima nitidez:
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Usa luz natural o iluminación uniforme</li>
                      <li>• Enfoca bien la abertura completa</li>
                      <li>• Toma la foto desde ángulo frontal</li>
                      <li>• Formato recomendado: JPG alta calidad</li>
                      <li>• Tamaño ideal: 1920px o más de ancho</li>
                    </ul>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="image"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      {previewUrl ? (
                        <div className="space-y-2">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="mx-auto h-40 object-cover rounded-lg"
                          />
                          <p className="text-sm text-gray-600">Haz clic para cambiar la imagen</p>
                          <div className="flex items-center justify-center gap-2 text-xs text-blue-600">
                            <Zap className="h-3 w-3" />
                            <span>Esta imagen será optimizada automáticamente</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600">
                            Arrastra una imagen o haz clic para seleccionar
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 5MB</p>
                          <div className="flex items-center justify-center gap-2 text-xs text-blue-600 mt-2">
                            <Zap className="h-3 w-3" />
                            <span>Optimización automática: 1920px • 95% calidad</span>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Título del Proyecto
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Puerta Balcón Serie Premium"
                    required
                  />
                </div>

                {/* Ubicación */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Ej: Lomas de Zamora, Buenos Aires"
                    required
                  />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Proyecto</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un tipo</option>
                    {projectTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descripción
                  </Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe el proyecto, características técnicas, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent min-h-[100px]"
                    required
                  />
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="w-full bg-[#1A3A52] hover:bg-[#112738]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Optimizando y subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir Proyecto Optimizado
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de proyectos existentes */}
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Existentes ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p>No hay proyectos aún. ¡Comienza subiendo el primero!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-4">
                        {/* Imagen */}
                        <div className="flex-shrink-0">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="h-20 w-20 object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* Información */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">{project.location}</span>
                          </div>
                          <div className="mt-1">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              {project.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        
                        {/* Acciones */}
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(project.image_url, '_blank')}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Ver
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(project.id, project.image_url)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información del bucket */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-gray-700">Bucket de Storage</h4>
                <p className="text-gray-600">portfolio-images</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Tabla de Base de Datos</h4>
                <p className="text-gray-600">portfolio_projects</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Total de Proyectos</h4>
                <p className="text-gray-600">{projects.length} proyectos activos</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Zap className="h-4 w-4" />
                <span>Todas las imágenes se optimizan automáticamente a 1920px con 95% de calidad</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}