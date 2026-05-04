"use client";

import { useState, useEffect, FormEvent } from "react";
import { supabase, portfolioApi, PortfolioProject } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
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
  Link,
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PortfolioAdminPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    type: "",
    image_url: "",
  });

  useEffect(() => {
    loadProjects();
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.image_url) {
      setMessage({ type: 'error', text: 'Por favor, completa título, ubicación y ruta de la imagen.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error: createError } = await portfolioApi.createProject({
      title: formData.title,
      location: formData.location,
      description: formData.description,
      type: formData.type,
      image_url: formData.image_url,
    });

    if (createError) {
      setMessage({ type: 'error', text: `Error al crear proyecto: ${createError.message}` });
    } else {
      setFormData({ title: "", location: "", description: "", type: "", image_url: "" });
      setMessage({ type: 'success', text: '¡Proyecto creado exitosamente!' });
      await loadProjects();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    setLoading(true);
    const { error } = await portfolioApi.deleteProject(id);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Portfolio</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los proyectos de instalaciones reales de VILKMET
          </p>
        </div>

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
                {/* Ruta de la imagen */}
                <div className="space-y-2">
                  <Label htmlFor="image_url" className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Ruta de la Imagen
                  </Label>

                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Instrucciones para subir imágenes
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>Guarda la foto en la carpeta <code className="bg-blue-100 px-1 rounded">public/projects/</code> del código</li>
                      <li>Escribe aquí la ruta: <code className="bg-blue-100 px-1 rounded">/projects/nombre-de-la-foto.jpg</code></li>
                      <li>Formatos recomendados: JPG o WEBP, máximo 1920px de ancho</li>
                      <li>Ejemplo: <code className="bg-blue-100 px-1 rounded">/projects/ventana-modena.jpg</code></li>
                    </ul>
                  </div>

                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="/projects/nombre-de-la-foto.jpg"
                    required
                  />

                  {formData.image_url && (
                    <div className="mt-3 border rounded-lg p-2 bg-gray-50">
                      <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        width={400}
                        height={250}
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe el proyecto, características técnicas, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A3A52] focus:border-transparent min-h-[100px]"
                    required
                  />
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#1A3A52] hover:bg-[#112738]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Proyecto
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
                  <p>No hay proyectos aún. ¡Comienza creando el primero!</p>
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
                          <Image
                            src={project.image_url}
                            alt={project.title}
                            width={80}
                            height={80}
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
                            onClick={() => handleDelete(project.id)}
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

        {/* Información de la base de datos */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                <Info className="h-4 w-4" />
                <span>Recuerda que para subir nuevas obras, debes guardar la foto en la carpeta <code className="bg-blue-50 px-1 rounded">public/projects</code> del código con el mismo nombre que escribas aquí.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
