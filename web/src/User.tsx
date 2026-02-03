// import React, { useEffect, useState } from "react";
// import type { ConvertedUser } from "./types/types.ts";
// import { Card, Collapse, Descriptions, List } from "antd";

// const User: React.FC = () => {
//   const [user, setUserList] = useState<ConvertedUser>();
//   const [error, setError] = useState<string | null>(null);
//   //Deconstruction
//   //const parameter = useParams();
//   //const { userName } = parameter

//   useEffect(() => {
//     fetch(import.meta.env.VITE_APIURL + "/user") // Port/Host anpassen
//       .then((res): Promise<ConvertedUser> => {
//         if (!res.ok) throw new Error("Netzwerkfehler");
//         return res.json();
//       })
//       .then((data: ConvertedUser) => setUserList(data))
//       .catch((err) => setError(err.message));
//   }, []);
//   if (error) return <div>Fehler: {error}</div>;
//   if (!user) return <div>Lade...</div>;
//   return (
//     <div>
//       <Card>
//         <Descriptions
//           title={`${user?.displayname}'s Account Details`}
//           items={[
//             {
//               key: "username",
//               label: "Username",
//               children: user?.credentials.replace(/:.*/, ""),
//             },
//             {
//               key: "password",
//               label: "Password",
//               children: user?.credentials.replace(/^[^:]+:/, ""),
//             },
//           ]}
//           column={1}
//         />
//       </Card>
//       {/* defaultActiveKey={["owned"]} */}
//       <Collapse>
//         <Collapse.Panel header="Services owned by me" key="owned">
//           <List
//             dataSource={user.owned!.map((e, i) => <li key={i}>{e}</li>)}
//             renderItem={(item) => <List.Item>{item}</List.Item>}
//           />
//         </Collapse.Panel>
//         <Collapse.Panel header="Groups" key="groups">
//           <List
//             dataSource={user.groups!.map((e, i) => <li key={i}>{e}</li>)}
//             renderItem={(item) => <List.Item>{item}</List.Item>}
//           />
//         </Collapse.Panel>
//         <Collapse.Panel header="Group Invitations" key="group invitations">
//           <List
//             dataSource={user.userGroupInvitations!.map((e, i) => (
//               <li key={i}>{e}</li>
//             ))}
//             renderItem={(item) => <List.Item>{item}</List.Item>}
//           />
//         </Collapse.Panel>
//         <Collapse.Panel header="Owned Groups" key="owned groups">
//           <List
//             dataSource={user.ownedGroups!.map((e, i) => <li key={i}>{e}</li>)}
//             renderItem={(item) => <List.Item>{item}</List.Item>}
//           />
//         </Collapse.Panel>
//       </Collapse>
//     </div>
//   );
// };

// export default User;

import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "./Context/AuthContext.tsx";

const User: React.FC = () => {
  const { displayname } = useParams();
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (displayname && user.displayname !== displayname) {
    return <div>Forbidden — das ist nicht dein Profil</div>;
  }

  return (
    <div>
      <h1>Profil: {displayname}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default User;
