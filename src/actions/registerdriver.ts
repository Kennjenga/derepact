"use server";

import { prisma } from "@/lib/prisma";
import ImageKit from "imagekit";
import { verifyImageWithGemini } from "@/lib/googleGemini";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function handleDriverFormSubmission(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const vehicleType = formData.get("vehicleType") as string;
    const workArea = formData.get("workArea") as string;
    const idNumber = formData.get("idNumber") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;

    const idPhoto = formData.get("idPhoto") as File;
    const psvPhoto = formData.get("psvPhoto") as File;
    const licensePhoto = formData.get("licensePhoto") as File;
    const goodConductPhoto = formData.get("goodConductPhoto") as File;

    if (!email || !vehicleType || !workArea || !idNumber || !dateOfBirth) {
      throw new Error("All required fields must be filled.");
    }

    if (!idPhoto || !psvPhoto || !licensePhoto || !goodConductPhoto) {
      throw new Error("All required documents must be uploaded.");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { uid: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const driver = await prisma.driver.create({
      data: {
        vehicle_type: vehicleType,
        work_area: workArea,
        id_number: idNumber,
        date_of_birth: new Date(dateOfBirth),
        id_photo_url: "",
        psv_photo_url: "",
        license_photo_url: "",
        good_conduct_photo_url: "",
        is_verified: false,
        user: {
          connect: { uid: user.uid },
        },
      },
    });

    const uploadToImageKit = async (file: File, folder: string) => {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      const response = await imagekit.upload({
        file: base64,
        fileName: file.name,
        folder,
      });

      return response.url;
    };

    const idPhotoUrl = await uploadToImageKit(idPhoto, "drivers/id_photos");
    const psvPhotoUrl = await uploadToImageKit(psvPhoto, "drivers/psv_photos");
    const licensePhotoUrl = await uploadToImageKit(
      licensePhoto,
      "drivers/license_photos"
    );
    const goodConductPhotoUrl = await uploadToImageKit(
      goodConductPhoto,
      "drivers/good_conduct_photos"
    );

    const isIdPhotoValid = await verifyImageWithGemini(idPhotoUrl);
    const isPsvPhotoValid = await verifyImageWithGemini(psvPhotoUrl);
    const isLicensePhotoValid = await verifyImageWithGemini(licensePhotoUrl);
    const isGoodConductPhotoValid = await verifyImageWithGemini(
      goodConductPhotoUrl
    );

    const isVerified =
      isIdPhotoValid &&
      isPsvPhotoValid &&
      isLicensePhotoValid &&
      isGoodConductPhotoValid;

    await prisma.driver.update({
      where: { id: driver.id },
      data: {
        id_photo_url: idPhotoUrl,
        psv_photo_url: psvPhotoUrl,
        license_photo_url: licensePhotoUrl,
        good_conduct_photo_url: goodConductPhotoUrl,
        is_verified: isVerified,
      },
    });

    return {
      success: true,
      message: isVerified
        ? "Driver information submitted and verified successfully."
        : "Driver information submitted, but verification failed.",
    };
  } catch (error) {
    console.error("Error handling driver form submission:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred.",
    };
  }
}