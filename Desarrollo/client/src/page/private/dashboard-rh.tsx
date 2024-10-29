"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Users, BookOpen, CheckCircle, PercentIcon, FileDown } from "lucide-react";
// Exportación PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


// Datos de ejemplo
const userData = {
  total: 500,
  active: 450,
  inactive: 50,
  byDepartment: [
    { name: "Ventas", total: 150, active: 140 },
    { name: "Marketing", total: 100, active: 95 },
    { name: "Desarrollo", total: 120, active: 110 },
    { name: "RRHH", total: 50, active: 45 },
    { name: "Finanzas", total: 80, active: 60 },
  ],
};

const courseData = {
  total: 50,
  completed: 1200,
  completionRate: 80,
  byDepartment: [
    { name: "Ventas", completed: 400, total: 450 },
    { name: "Marketing", completed: 280, total: 300 },
    { name: "Desarrollo", completed: 320, total: 360 },
    { name: "RRHH", completed: 90, total: 100 },
    { name: "Finanzas", completed: 110, total: 150 },
  ],
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function DashboardRRHH() {
  const [selectedDepartment, setSelectedDepartment] = useState("Todos");
  const [areas, setAreas] = useState<any[]>([])


  const filteredUserData =
    selectedDepartment === "Todos"
      ? userData.byDepartment
      : userData.byDepartment.filter(
        (dept) => dept.name === selectedDepartment
      );

  const filteredCourseData =
    selectedDepartment === "Todos"
      ? courseData.byDepartment
      : courseData.byDepartment.filter(
        (dept) => dept.name === selectedDepartment
      );

  // LLAMADO DE ÁREAS 

  const cargarAreas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/area')
      if (!response.ok) {
        throw new Error("HHTP error! status:");
      }
      const data = await response.json()
      setAreas(data);
    } catch (error) {
      console.error('Error al cargar áreas:', error);
    }
  }
  console.log(areas);
  
  const exportToPDF = () => {
    const doc = new jsPDF()

    // Título
    doc.setFontSize(18)
    doc.text('Informe de RRHH', 14, 22)

    // Resumen de Usuarios
    doc.setFontSize(14)
    doc.text('Resumen de Usuarios', 14, 32)
    autoTable(doc, {
      startY: 38,
      head: [['Total', 'Activos', 'Inactivos']],
      body: [[userData.total, userData.active, userData.inactive]],
    })

    // Usuarios por Departamento
    doc.setFontSize(14)
    doc.text('Usuarios por Departamento', 14, 60)
    autoTable(doc, {
      startY: 66,
      head: [['Departamento', 'Total', 'Activos']],
      body: userData.byDepartment.map(dept => [dept.name, dept.total, dept.active]),
    })

    // Resumen de Cursos
    doc.setFontSize(14)
    doc.text('Resumen de Cursos', 14, 120)
    autoTable(doc, {
      startY: 126,
      head: [['Total de Cursos', 'Cursos Completados', 'Tasa de Finalización']],
      body: [[courseData.total, courseData.completed, `${courseData.completionRate}%`]],
    })

    // Cursos por Departamento
    doc.setFontSize(14)
    doc.text('Cursos por Departamento', 14, 150)
    autoTable(doc, {
      startY: 156,
      head: [['Departamento', 'Completados', 'Total']],
      body: courseData.byDepartment.map(dept => [dept.name, dept.completed, dept.total]),
    })

    doc.save('informe-rrhh.pdf')
  }
  useEffect(() =>{
    cargarAreas();
  }, [])

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard para Recursos Humanos</h1>
        <Button onClick={exportToPDF} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar a PDF
        </Button>
      </div>
      <div className="mb-6">
        <Select onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Seleccionar Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos los departamentos</SelectItem>
            {areas.map((dept) => (
              <SelectItem key={dept.name} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuarios
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios Activos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.active}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios Inactivos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.inactive}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Usuarios por Departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredUserData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" name="Total" />
                    <Bar dataKey="active" fill="#82ca9d" name="Activos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Cursos
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courseData.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Cursos Finalizados
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courseData.completed}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tasa de Finalización
                </CardTitle>
                <PercentIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {courseData.completionRate}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cursos Completados por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredCourseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="completed"
                        fill="#8884d8"
                        name="Completados"
                      />
                      <Bar dataKey="total" fill="#82ca9d" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Cursos Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredCourseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="completed"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {filteredCourseData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
