import { updateDemandeDate } from "@/actions/dashboard";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, dateRdv, heureRdv } = body;

    if (!id || !dateRdv || !heureRdv) {
      return NextResponse.json(
        {
          success: false,
          error: "Les champs id, dateRdv et heureRdv sont requis",
        },
        { status: 400 }
      );
    }

    const result = await updateDemandeDate(id, new Date(dateRdv), heureRdv);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Erreur dans l'API update-date:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la mise à jour",
      },
      { status: 500 }
    );
  }
}

