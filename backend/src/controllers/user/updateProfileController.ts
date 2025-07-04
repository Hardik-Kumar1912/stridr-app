import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";

interface UpdateProfileBody {
  name?: string;
  age?: number;
  address?: string;
  gender?: string;
  profileImage?: string;
  priorities?: string[];
}

export async function updateProfileController(
  req: Request,
  res: Response
): Promise<Response | void> {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const body: UpdateProfileBody = req.body;
    const { name, age, address, gender, profileImage, priorities } = body;

    const response = await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        age,
        address,
        gender,
        priorities,
        profileImage,
      },
    });
    if (!response) {
      return res.status(400).json({ error: "Failed to update profile" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("Error saving profile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
