'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


interface FormularioAreaProps {
  onCreate: () => void;
}

const FormularioArea: React.FC<FormularioAreaProps> = ({ onCreate }) => {


  const [formData, setFormData] = useState({
    nombre_area: ""
  })

  const [areas, setAreas] = useState<any[]>([]);

  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const { name, value } = target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let formDatatoSend = { ...formData };

    if (formDatatoSend.nombre_area.trim() === '' || formDatatoSend.nombre_area === null || formDatatoSend.nombre_area === undefined) {
      toast.error('El Área es requerida')
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDatatoSend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json();
      toast.success('Área creada exitosamente')
      setAreas(prevAreas => [...prevAreas, data])
    } catch (error) {
      console.error('Error al Crear el Área:', error);
    }
    onCreate();
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Formulario de Área</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_area">Nombre del área</Label>
              <Input
                type="text"
                placeholder="Ingresa el nombre del área"
                name='nombre_area'
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Crear</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default FormularioArea;