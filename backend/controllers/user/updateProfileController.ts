import { clerkClient, getAuth } from "@clerk/express";

export const updateProfileController = async (req, res , next) => {};

export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, age, address, gender, profileImage, priorities } = body;

    const res = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        age,
        address,
        gender,
        priorities,
        profileImage,
      },
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error saving profile:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
