import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [container] = React.useState(() => document.createElement("div"));
  useEffect(() => {
    container.setAttribute("id", "modal-root");
    document.body.appendChild(container);
    return () => { document.body.removeChild(container); };
  }, [container]);
  return createPortal(children, container);
};