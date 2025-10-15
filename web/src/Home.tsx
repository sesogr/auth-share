import React, { useEffect, useState } from "react";
import type { ConvertedService } from "./types/ConvertedService.ts";
import { useParams } from "react-router-dom";
import Service from "./Service.tsx";
import { useNavigate } from "react-router-dom";
import CreateService from "./CreateService.tsx";
const Home: React.FC = () => {
  const [serviceList, setServiceList] = useState<ConvertedService[]>([]);
  const [error, setError] = useState<string | null>(null);
  //Deconstruction
  //const parameter = useParams();
  //const { serviceName } = parameter
  const navigate = useNavigate();
  const { serviceName } = useParams();
  useEffect(() => {
    fetch(import.meta.env.VITE_APIURL + "/user/owned") // Port/Host anpassen
      .then((res): Promise<ConvertedService[]> => {
        if (!res.ok) throw new Error("Netzwerkfehler");
        return res.json();
      })
      .then((data: ConvertedService[]) => setServiceList(data))
      .catch((err) => setError(err.message));
  }, []);
  if (error) return <div>Fehler: {error}</div>;
  if (serviceList.length == 0) return <CreateService />;

  const service = serviceName
    ? serviceList.find(
      (currService: ConvertedService) => serviceName == currService.serviceName,
    )
    : undefined;

  return (
    <div>
      <h1>Service List</h1>
      <ul>
        {Array.isArray(serviceList) &&
          serviceList.map((e: ConvertedService) => {
            //should be the final path like "/serviceName/details or /serviceName/settings"??
            const urlPath = "/" + e.serviceName;
            return (
              <li>
                {e.serviceName}
                <button
                  type="button"
                  onClick={() => navigate(urlPath)}
                  aria-label={`Launch the ${e.serviceName}`}
                >
                  Launch
                </button>
                <button
                  type="button"
                  onClick={() => navigate(urlPath)}
                  aria-label={`Settings for ${e.serviceName}`}
                >
                  Settings
                </button>
              </li>
            );
          })}
      </ul>
      {service && <Service service={service} />}
    </div>
  );
};

export default Home;

// import React, { useEffect, useState } from "react";
// import type { ConvertedService } from "./types/ConvertedService.ts";
// import { useParams } from "react-router-dom";
// import Service from "./Service.tsx";
// import { useNavigate } from "react-router-dom";
// import CreateService from "./CreateService.tsx";

// const Home: React.FC = () => {
//   const [serviceList, setServiceList] = useState<ConvertedService[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const { serviceName } = useParams();

//   useEffect(() => {
//     fetch(import.meta.env.VITE_APIURL + "/user/owned")
//       .then((res): Promise<ConvertedService[]> => {
//         if (!res.ok) throw new Error("Netzwerkfehler");
//         return res.json();
//       })
//       .then((data: ConvertedService[]) => setServiceList(data))
//       .catch((err) => setError(err.message));
//   }, []);

//   if (error) return <div>Fehler: {error}</div>;
//   if (serviceList.length === 0) return <CreateService />;

//   const service = serviceName
//     ? serviceList.find(
//       (currService: ConvertedService) =>
//         serviceName === currService.serviceName,
//     )
//     : undefined;

//   // Helper: open service url in new tab. Falls service.url fehlt, navigiert intern.
//   const openInNewTab = (e: ConvertedService) => {
//     // Priorität: use explicit url on service if present, sonst fallback to internal path
//     const targetUrl = (e as any).url ?? `/${e.serviceName}`;
//     // If URL looks like relative internal path, open in new tab using origin + path
//     const isExternal = /^https?:\/\//i.test(targetUrl);
//     if (isExternal) {
//       window.open(targetUrl, "_blank", "noopener,noreferrer");
//     } else {
//       // For internal path open new tab with same origin
//       const full = window.location.origin + targetUrl;
//       window.open(full, "_blank", "noopener,noreferrer");
//     }
//   };

//   return (
//     <div>
//       <h1>Service List</h1>
//       <ul>
//         {Array.isArray(serviceList) &&
//           serviceList.map((e: ConvertedService) => {
//             const urlPath = "/" + e.serviceName;
//             return (
//               <li key={e.serviceName}>
//                 {e.serviceName}
//                 <button
//                   type="button"
//                   onClick={() => openInNewTab(e)}
//                   aria-label={`Launch the ${e.serviceName}`}
//                 >
//                   Launch
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => navigate(urlPath)}
//                   aria-label={`Settings for ${e.serviceName}`}
//                 >
//                   Settings
//                 </button>
//               </li>
//             );
//           })}
//       </ul>
//       {service && <ServiceWithClipboard service={service} />}
//     </div>
//   );
// };

// export default Home;

// /**
//  * Wrapper component providing clipboard copy buttons for credentials.
//  * Erwartet, dass service.credentials?.user und service.credentials?.password existieren.
//  * Anpassungen wenn Feldnamen anders sind.
//  */
// type ServiceWithClipboardProps = {
//   service: ConvertedService;
// };

// const ServiceWithClipboard: React.FC<ServiceWithClipboardProps> = (
//   { service },
// ) => {
//   const [copied, setCopied] = useState<string | null>(null);

//   const copyToClipboard = async (text: string | undefined, label: string) => {
//     if (!text) return;
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(label);
//       // clear after 30s
//       setTimeout(() => setCopied(null), 30000);
//     } catch (err) {
//       // Fallback: create temporary textarea
//       const ta = document.createElement("textarea");
//       ta.value = text;
//       document.body.appendChild(ta);
//       ta.select();
//       try {
//         document.execCommand("copy");
//         setCopied(label);
//       } catch {
//         // ignore
//       }
//       ta.remove();
//       setTimeout(() => setCopied(null), 1500);
//     }
//   };

//   // adjust these paths if your ConvertedService uses different names
//   const user =
//     // @ts-ignore
//     service.credentials?.user ?? (service as any).username ??
//       (service as any).name;
//   const password =
//     // @ts-ignore
//     service.credentials?.password ?? (service as any).password;

//   return (
//     <div style={{ marginTop: 16 }}>
//       <h2>{service.serviceName}</h2>
//       <div>
//         <strong>Name:</strong> {user ?? "—"}
//         <button
//           onClick={() => copyToClipboard(user ?? undefined, "name")}
//           disabled={!user}
//           aria-label="Copy username"
//           style={{ marginLeft: 8 }}
//         >
//           Copy
//         </button>
//         {copied === "name" && <span style={{ marginLeft: 8 }}>Copied</span>}
//       </div>
//       <div style={{ marginTop: 8 }}>
//         <strong>Password:</strong> {password ? "••••••••" : "—"}
//         <button
//           onClick={() => copyToClipboard(password ?? undefined, "password")}
//           disabled={!password}
//           aria-label="Copy password"
//           style={{ marginLeft: 8 }}
//         >
//           Copy
//         </button>
//         {copied === "password" && <span style={{ marginLeft: 8 }}>Copied</span>}
//       </div>
//       <div style={{ marginTop: 12 }}>
//         <a
//           href={service.url ?? `/${service.serviceName}`}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Open in new tab
//         </a>
//       </div>
//       {/* Render original Service component (read-only) if desired */}
//       <div style={{ marginTop: 12 }}>
//         <Service service={service} />
//       </div>
//     </div>
//   );
// };
