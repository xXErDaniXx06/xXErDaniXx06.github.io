// Atributos de la API declarativa de WebMCP para exponer formularios a agentes de IA
// (https://github.com/webmachinelearning/webmcp/blob/main/declarative-api-explainer.md).
declare namespace astroHTML.JSX {
  interface FormHTMLAttributes {
    toolname?: string;
    tooldescription?: string;
    toolautosubmit?: boolean | string;
  }
  interface InputHTMLAttributes {
    toolparamdescription?: string;
    toolparamtitle?: string;
  }
  interface TextareaHTMLAttributes {
    toolparamdescription?: string;
    toolparamtitle?: string;
  }
}
