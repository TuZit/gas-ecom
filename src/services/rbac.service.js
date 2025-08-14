// import resourceModel from "../models/";

import resourceModel from "../models/resource.model.js";
import roleModel from "../models/role.model.js";

const createResource = async ({
  name = "profile",
  slug = "p0001",
  description = "",
}) => {
  try {
    // 1. check resource is exist

    // 2. create new
    const resource = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });

    return resource;
  } catch (error) {
    console.error(error);
  }
};

const getResourceList = async ({
  userId = 1,
  limit = 50,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. check admin ?, middleware function

    // 2. get list

    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createAt: 1,
        },
      },
    ]);
    return resources;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const createRole = async ({
  name = "shop",
  slug = "s0001",
  description = "",
  grants = [],
}) => {
  try {
    // 1. check role is exited

    // 2. create new
    const role = await roleModel.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants,
    });

    return role;
  } catch (error) {
    console.error(error);
  }
};

const getListRoles = async ({
  userId = 1,
  limit = 50,
  offset = 0,
  search = "",
}) => {
  try {
    // 1. userId

    // 2. get list

    const roles = await roleModel.aggregate([
      {
        $unwind: "$rol_grants",
      },
      {
        $lookup: {
          from: "Resources",
          localField: "rol_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $project: {
          role: "$rol_name",
          resource: "$resource.src_name",
          actions: "$rol_grants.actions",
          attributes: "$rol_grants.attributes",
        },
      },
      {
        $unwind: "$actions",
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          actions: "$actions",
          attributes: 1,
        },
      },
    ]);
    return roles;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export { createRole, createResource, getResourceList, getListRoles };
