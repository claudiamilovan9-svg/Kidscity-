import type { Metadata } from "next";
import LegalPage from "../legal/LegalPage";
export const metadata: Metadata = {title: "Politica de cookies | KidsCity", robots:{index:false,follow:false}};
export default function Page(){return <LegalPage title="Politica de cookies" active="/cookies" sections={[{"title":"Ce sunt cookie-urile","body":"Conținut în curs de definitivare și validare."},{"title":"Tehnologii necesare autentificării","body":"Conținut în curs de definitivare și validare."},{"title":"Inventarul tehnologiilor","body":"Conținut în curs de definitivare și validare."},{"title":"Preferințe și control","body":"Conținut în curs de definitivare și validare."}]}/>;}
