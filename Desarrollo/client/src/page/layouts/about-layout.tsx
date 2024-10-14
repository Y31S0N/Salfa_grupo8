import About from "../../page/public/about";
import capacitacion from "../../assets/capacitacion.png";

export default function About_layout() {
  const aboutProps = {
    companyName: "Tu Empresa",
    tagline: "Tu eslogan impactante aquí",
    description: "Una breve descripción de tu empresa y lo que la hace única.",
    features: [
      {
        title: "Característica 1",
        description: "Descripción de la característica 1",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
      },
      {
        title: "Característica 2",
        description: "Descripción de la característica 2",
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ),
      },
      // Añade más características según sea necesario
    ],
    imageSrc: capacitacion,
    imageAlt: "Descripción de la imagen",
  };

  return (
    <div>
      <About {...aboutProps} />
    </div>
  );
}
