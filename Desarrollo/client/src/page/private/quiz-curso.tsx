'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"

type Opcion = {
  id: string;
  texto: string;
}

type Pregunta = {
  id: string;
  texto: string;
  opciones: Opcion[];
  respuestaCorrecta: string;
}

type Quiz = {
  id: string;
  titulo: string;
  descripcion: string;
  preguntas: Pregunta[];
}

// Datos de ejemplo para el quiz
const quizEjemplo: Quiz = {
  id: "quiz1",
  titulo: "Quiz de Mantenimiento de Maquinaria",
  descripcion: "Evalúa tu conocimiento sobre los conceptos básicos de mantenimiento industrial.",
  preguntas: [
    {
      id: "q1",
      texto: "¿Cuál es el principal objetivo del mantenimiento preventivo?",
      opciones: [
        { id: "a", texto: "Reparar equipos cuando se rompen" },
        { id: "b", texto: "Prevenir fallas antes de que ocurran" },
        { id: "c", texto: "Reemplazar equipos antiguos" },
        { id: "d", texto: "Aumentar la producción" }
      ],
      respuestaCorrecta: "b"
    },
    {
      id: "q2",
      texto: "¿Qué herramienta se utiliza comúnmente para medir la vibración en maquinaria?",
      opciones: [
        { id: "a", texto: "Termómetro" },
        { id: "b", texto: "Manómetro" },
        { id: "c", texto: "Acelerómetro" },
        { id: "d", texto: "Voltímetro" }
      ],
      respuestaCorrecta: "c"
    },
    {
      id: "q3",
      texto: "¿Cuál de los siguientes NO es un tipo común de mantenimiento industrial?",
      opciones: [
        { id: "a", texto: "Mantenimiento correctivo" },
        { id: "b", texto: "Mantenimiento preventivo" },
        { id: "c", texto: "Mantenimiento predictivo" },
        { id: "d", texto: "Mantenimiento imaginativo" }
      ],
      respuestaCorrecta: "d"
    },
    {
      id: "q4",
      texto: "¿Qué significa MTBF en el contexto del mantenimiento?",
      opciones: [
        { id: "a", texto: "Tiempo medio entre fallas" },
        { id: "b", texto: "Método total de fallas básicas" },
        { id: "c", texto: "Mantenimiento total de baja frecuencia" },
        { id: "d", texto: "Medida técnica de funcionamiento básico" }
      ],
      respuestaCorrecta: "a"
    },
    {
      id: "q5",
      texto: "¿Cuál es el propósito principal de un análisis de aceite en mantenimiento?",
      opciones: [
        { id: "a", texto: "Mejorar el rendimiento del motor" },
        { id: "b", texto: "Detectar contaminantes y desgaste" },
        { id: "c", texto: "Reducir el consumo de combustible" },
        { id: "d", texto: "Aumentar la viscosidad del aceite" }
      ],
      respuestaCorrecta: "b"
    }
  ]
};

export default function QuizCurso() {
  const [quizActual, setQuizActual] = useState<Quiz>(quizEjemplo);
  const [respuestasUsuario, setRespuestasUsuario] = useState<{ [key: string]: string }>({});
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [quizCompletado, setQuizCompletado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(0);

  const handleRespuesta = (preguntaId: string, opcionId: string) => {
    setRespuestasUsuario(prev => ({ ...prev, [preguntaId]: opcionId }));
  };

  const irAPreguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(prev => prev - 1);
    }
  };

  const irASiguientePregunta = () => {
    if (preguntaActual < quizActual.preguntas.length - 1) {
      setPreguntaActual(prev => prev + 1);
    } else {
      finalizarQuiz();
    }
  };

  const finalizarQuiz = () => {
    let aciertos = 0;
    quizActual.preguntas.forEach(pregunta => {
      if (respuestasUsuario[pregunta.id] === pregunta.respuestaCorrecta) {
        aciertos++;
      }
    });
    setPuntuacion((aciertos / quizActual.preguntas.length) * 100);
    setQuizCompletado(true);
  };

  const reiniciarQuiz = () => {
    setRespuestasUsuario({});
    setPreguntaActual(0);
    setQuizCompletado(false);
    setPuntuacion(0);
  };

  const pregunta = quizActual.preguntas[preguntaActual];

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quizActual.titulo}</CardTitle>
          <CardDescription>{quizActual.descripcion}</CardDescription>
        </CardHeader>
        <CardContent>
          {!quizCompletado ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Pregunta {preguntaActual + 1} de {quizActual.preguntas.length}
              </h3>
              <p className="mb-4">{pregunta.texto}</p>
              <RadioGroup
                onValueChange={(value) => handleRespuesta(pregunta.id, value)}
                value={respuestasUsuario[pregunta.id]}
              >
                {pregunta.opciones.map((opcion) => (
                  <div key={opcion.id} className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value={opcion.id} id={`${pregunta.id}-${opcion.id}`} />
                    <Label htmlFor={`${pregunta.id}-${opcion.id}`}>{opcion.texto}</Label>
                  </div>
                ))}
              </RadioGroup>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Quiz Completado</h3>
              <p className="text-xl mb-4">Tu puntuación: {puntuacion.toFixed(0)}%</p>
              <Progress value={puntuacion} className="w-full mb-4" />
              {puntuacion >= 70 ? (
                <div className="flex items-center justify-center text-green-500 mb-4">
                  <CheckCircle className="mr-2" />
                  <span>¡Felicidades! Has aprobado el quiz.</span>
                </div>
              ) : (
                <div className="flex items-center justify-center text-yellow-500 mb-4">
                  <AlertCircle className="mr-2" />
                  <span>Necesitas repasar un poco más. ¡Inténtalo de nuevo!</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!quizCompletado ? (
            <>
              <Button 
                onClick={irAPreguntaAnterior} 
                disabled={preguntaActual === 0}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
              <Button onClick={irASiguientePregunta}>
                {preguntaActual < quizActual.preguntas.length - 1 ? (
                  <>
                    Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  "Finalizar Quiz"
                )}
              </Button>
            </>
          ) : (
            <Button onClick={reiniciarQuiz}>Reiniciar Quiz</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}