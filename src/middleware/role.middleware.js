import AccessControl from "accesscontrol";

let grantList = [
  {
    role: "admin",
    resource: "profile",
    action: "read:any",
    attributes: "*, !views",
  },
  { role: "shop", resource: "profile", action: "read:own", attributes: "*" },
];

export default new AccessControl(grantList);
